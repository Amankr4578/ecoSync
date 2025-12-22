import express from 'express';
import User from '../models/User.js';
import Pickup from '../models/Pickup.js';
import { adminProtect } from '../middleware/adminAuth.js';

const router = express.Router();

// @route   GET /api/admin/stats
// @desc    Get system-wide statistics
// @access  Admin
router.get('/stats', adminProtect, async (req, res) => {
    try {
        // User stats
        const totalUsers = await User.countDocuments({ role: 'user' });
        const newUsersThisMonth = await User.countDocuments({
            role: 'user',
            createdAt: { $gte: new Date(new Date().setDate(1)) }
        });

        // Pickup stats
        const totalPickups = await Pickup.countDocuments();
        const pendingPickups = await Pickup.countDocuments({ status: 'pending' });
        const completedPickups = await Pickup.countDocuments({ status: 'completed' });
        const cancelledPickups = await Pickup.countDocuments({ status: 'cancelled' });
        const inProgressPickups = await Pickup.countDocuments({ status: 'in-progress' });

        // Aggregate stats
        const wasteStats = await Pickup.aggregate([
            { $match: { status: 'completed' } },
            {
                $group: {
                    _id: null,
                    totalWeight: { $sum: '$actualWeight' },
                    totalPoints: { $sum: '$ecoPointsEarned' }
                }
            }
        ]);

        // Recent pickups
        const recentPickups = await Pickup.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(10);

        // Recent users
        const recentUsers = await User.find({ role: 'user' })
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(5);

        // Pickups by status for chart
        const pickupsByStatus = {
            pending: pendingPickups,
            inProgress: inProgressPickups,
            completed: completedPickups,
            cancelled: cancelledPickups
        };

        // Pickups by waste type
        const pickupsByType = await Pickup.aggregate([
            {
                $group: {
                    _id: '$wasteType',
                    count: { $sum: 1 },
                    totalWeight: { $sum: '$actualWeight' }
                }
            }
        ]);

        res.json({
            users: {
                total: totalUsers,
                newThisMonth: newUsersThisMonth
            },
            pickups: {
                total: totalPickups,
                pending: pendingPickups,
                inProgress: inProgressPickups,
                completed: completedPickups,
                cancelled: cancelledPickups,
                byStatus: pickupsByStatus,
                byType: pickupsByType
            },
            totals: {
                wasteRecycled: wasteStats[0]?.totalWeight || 0,
                ecoPointsAwarded: wasteStats[0]?.totalPoints || 0,
                carbonOffset: (wasteStats[0]?.totalWeight || 0) * 2.5 // Rough estimate
            },
            recentPickups,
            recentUsers
        });
    } catch (error) {
        console.error('Admin stats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/admin/users
// @desc    Get all users with pagination
// @access  Admin
router.get('/users', adminProtect, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const role = req.query.role || '';

        const query = {};
        
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }
        
        if (role) {
            query.role = role;
        }

        const total = await User.countDocuments(query);
        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({
            users,
            page,
            pages: Math.ceil(total / limit),
            total
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/admin/users/:id
// @desc    Get single user
// @access  Admin
router.get('/users/:id', adminProtect, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get user's pickups
        const pickups = await Pickup.find({ user: req.params.id })
            .sort({ createdAt: -1 })
            .limit(20);

        res.json({ user, pickups });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/admin/users/:id
// @desc    Update user
// @access  Admin
router.put('/users/:id', adminProtect, async (req, res) => {
    try {
        const { name, email, phone, location, role, ecoPoints, level } = req.body;
        
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update fields
        if (name) user.name = name;
        if (email) user.email = email;
        if (phone !== undefined) user.phone = phone;
        if (location !== undefined) user.location = location;
        if (role) user.role = role;
        if (ecoPoints !== undefined) user.ecoPoints = ecoPoints;
        if (level !== undefined) user.level = level;

        await user.save();

        res.json(user);
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
// @access  Admin
router.delete('/users/:id', adminProtect, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prevent deleting self
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'Cannot delete your own account' });
        }

        // Delete user's pickups
        await Pickup.deleteMany({ user: req.params.id });
        
        // Delete user
        await User.findByIdAndDelete(req.params.id);

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/admin/pickups
// @desc    Get all pickups with filters
// @access  Admin
router.get('/pickups', adminProtect, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status || '';
        const wasteType = req.query.wasteType || '';
        const search = req.query.search || '';

        const query = {};
        
        if (status) {
            query.status = status;
        }
        
        if (wasteType) {
            query.wasteType = wasteType;
        }

        // First get pickups with populated user
        let pickupsQuery = Pickup.find(query)
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        const total = await Pickup.countDocuments(query);
        const pickups = await pickupsQuery
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({
            pickups,
            page,
            pages: Math.ceil(total / limit),
            total
        });
    } catch (error) {
        console.error('Get pickups error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/admin/pickups/:id
// @desc    Update pickup status and admin notes
// @access  Admin
router.put('/pickups/:id', adminProtect, async (req, res) => {
    try {
        const { status, adminNotes } = req.body;
        
        const pickup = await Pickup.findById(req.params.id);
        
        if (!pickup) {
            return res.status(404).json({ message: 'Pickup not found' });
        }

        const previousStatus = pickup.status;

        // Update status if provided
        if (status) pickup.status = status;
        
        // Update admin notes (separate from user notes)
        if (adminNotes !== undefined) pickup.adminNotes = adminNotes;

        // If completing pickup, calculate and award eco points
        if (status === 'completed' && previousStatus !== 'completed') {
            const weight = pickup.estimatedWeight || 0;
            const pointsPerKg = {
                recyclable: 10,
                organic: 5,
                ewaste: 20,
                hazardous: 15
            };
            const points = Math.round(weight * (pointsPerKg[pickup.wasteType] || 5));
            pickup.ecoPointsEarned = points;
            pickup.actualWeight = weight;
            pickup.completedAt = new Date();

            // Update user stats
            const user = await User.findById(pickup.user);
            if (user) {
                user.ecoPoints = (user.ecoPoints || 0) + points;
                user.totalRecycled = (user.totalRecycled || 0) + weight;
                user.carbonOffset = (user.carbonOffset || 0) + (weight * 2.5);
                user.level = Math.floor(user.ecoPoints / 1000) + 1;
                await user.save();
            }
        }

        await pickup.save();

        // Create notification for status changes
        if (status && status !== previousStatus) {
            const { createNotification } = await import('./notificationRoutes.js');
            const wasteTypeLabel = pickup.wasteType.charAt(0).toUpperCase() + pickup.wasteType.slice(1);
            
            let notifTitle, notifMessage, notifType;
            
            switch (status) {
                case 'in-progress':
                    notifTitle = 'Pickup Accepted! 🎉';
                    notifMessage = `Your ${wasteTypeLabel} pickup (${pickup.pickupId}) has been accepted and is scheduled for collection.${adminNotes ? ` Note: ${adminNotes}` : ''}`;
                    notifType = 'pickup_accepted';
                    break;
                case 'completed':
                    notifTitle = 'Pickup Completed! ✅';
                    notifMessage = `Your ${wasteTypeLabel} pickup (${pickup.pickupId}) has been completed. You earned ${pickup.ecoPointsEarned} eco points!`;
                    notifType = 'pickup_completed';
                    break;
                case 'cancelled':
                    notifTitle = 'Pickup Declined';
                    notifMessage = `Your ${wasteTypeLabel} pickup (${pickup.pickupId}) could not be processed.${adminNotes ? ` Reason: ${adminNotes}` : ' Please contact support for assistance.'}`;
                    notifType = 'pickup_rejected';
                    break;
                default:
                    notifTitle = 'Pickup Status Updated';
                    notifMessage = `Your pickup (${pickup.pickupId}) status has been updated to ${status}.`;
                    notifType = 'system';
            }
            
            await createNotification(
                pickup.user,
                notifTitle,
                notifMessage,
                notifType,
                pickup._id,
                '/dashboard/history'
            );
        }

        // Return populated pickup
        const updatedPickup = await Pickup.findById(pickup._id).populate('user', 'name email avatar phone');

        res.json(updatedPickup);
    } catch (error) {
        console.error('Update pickup error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/admin/pickups/:id
// @desc    Delete pickup
// @access  Admin
router.delete('/pickups/:id', adminProtect, async (req, res) => {
    try {
        const pickup = await Pickup.findById(req.params.id);
        
        if (!pickup) {
            return res.status(404).json({ message: 'Pickup not found' });
        }

        await Pickup.findByIdAndDelete(req.params.id);

        res.json({ message: 'Pickup deleted successfully' });
    } catch (error) {
        console.error('Delete pickup error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
