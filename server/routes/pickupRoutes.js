import express from 'express';
import Pickup from '../models/Pickup.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all pickups for current user
// @route   GET /api/pickups
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const { status, limit = 10, page = 1 } = req.query;
        
        const query = { user: req.user._id };
        if (status && status !== 'all') {
            query.status = status;
        }

        const pickups = await Pickup.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const total = await Pickup.countDocuments(query);

        res.json({
            pickups,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            total
        });
    } catch (error) {
        console.error('Get pickups error:', error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
});

// @desc    Get user stats
// @route   GET /api/pickups/stats
// @access  Private
router.get('/stats', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        
        // Get recent pickups
        const recentPickups = await Pickup.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .limit(5);

        // Get next scheduled pickup
        const nextPickup = await Pickup.findOne({ 
            user: req.user._id,
            status: { $in: ['pending', 'scheduled'] },
            date: { $gte: new Date() }
        }).sort({ date: 1 });

        // Calculate monthly stats
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        lastMonth.setDate(1);
        lastMonth.setHours(0, 0, 0, 0);

        const endOfLastMonth = new Date();
        endOfLastMonth.setDate(0);
        endOfLastMonth.setHours(23, 59, 59, 999);

        const thisMonthPickups = await Pickup.find({
            user: req.user._id,
            status: 'completed',
            completedAt: { $gte: startOfMonth }
        });

        const lastMonthPickups = await Pickup.find({
            user: req.user._id,
            status: 'completed',
            completedAt: { $gte: lastMonth, $lte: endOfLastMonth }
        });

        const thisMonthRecycled = thisMonthPickups.reduce((sum, p) => sum + (p.actualWeight || 0), 0);
        const lastMonthRecycled = lastMonthPickups.reduce((sum, p) => sum + (p.actualWeight || 0), 0);

        const recycledTrend = lastMonthRecycled > 0 
            ? Math.round(((thisMonthRecycled - lastMonthRecycled) / lastMonthRecycled) * 100) 
            : thisMonthRecycled > 0 ? 100 : 0;

        res.json({
            totalRecycled: user.totalRecycled,
            carbonOffset: user.carbonOffset,
            ecoPoints: user.ecoPoints,
            level: user.level,
            recycledTrend: `${recycledTrend >= 0 ? '+' : ''}${recycledTrend}%`,
            recentPickups: recentPickups.map(p => ({
                type: p.wasteType.charAt(0).toUpperCase() + p.wasteType.slice(1),
                date: p.createdAt,
                status: p.status.charAt(0).toUpperCase() + p.status.slice(1)
            })),
            nextPickup: nextPickup ? {
                date: nextPickup.date,
                time: nextPickup.time,
                type: nextPickup.wasteType.charAt(0).toUpperCase() + nextPickup.wasteType.slice(1)
            } : null
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
});

// @desc    Create new pickup
// @route   POST /api/pickups
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { wasteType, date, time, address, estimatedWeight, notes } = req.body;

        const pickup = await Pickup.create({
            user: req.user._id,
            wasteType,
            date: new Date(date),
            time,
            address,
            estimatedWeight: parseFloat(estimatedWeight) || 0,
            notes
        });

        res.status(201).json(pickup);
    } catch (error) {
        console.error('Create pickup error:', error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
});

// @desc    Update pickup
// @route   PUT /api/pickups/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        const pickup = await Pickup.findById(req.params.id);

        if (!pickup) {
            return res.status(404).json({ message: 'Pickup not found' });
        }

        // Check user owns the pickup
        if (pickup.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const { wasteType, date, time, address, estimatedWeight, notes, status, actualWeight } = req.body;

        pickup.wasteType = wasteType || pickup.wasteType;
        pickup.date = date ? new Date(date) : pickup.date;
        pickup.time = time || pickup.time;
        pickup.address = address || pickup.address;
        pickup.estimatedWeight = estimatedWeight !== undefined ? parseFloat(estimatedWeight) : pickup.estimatedWeight;
        pickup.notes = notes !== undefined ? notes : pickup.notes;
        
        // Handle status change to completed
        if (status === 'completed' && pickup.status !== 'completed') {
            pickup.status = 'completed';
            pickup.completedAt = new Date();
            pickup.actualWeight = actualWeight || pickup.estimatedWeight;
            pickup.ecoPointsEarned = pickup.calculateEcoPoints();

            // Update user stats
            const user = await User.findById(req.user._id);
            user.totalRecycled += pickup.actualWeight;
            user.carbonOffset += Math.round(pickup.actualWeight * 0.7); // Rough CO2 offset calculation
            user.ecoPoints += pickup.ecoPointsEarned;
            user.level = Math.floor(user.ecoPoints / 1000) + 1;
            await user.save();
        } else if (status) {
            pickup.status = status;
        }

        const updatedPickup = await pickup.save();
        res.json(updatedPickup);
    } catch (error) {
        console.error('Update pickup error:', error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
});

// @desc    Cancel/Delete pickup
// @route   DELETE /api/pickups/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const pickup = await Pickup.findById(req.params.id);

        if (!pickup) {
            return res.status(404).json({ message: 'Pickup not found' });
        }

        // Check user owns the pickup
        if (pickup.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Soft delete - just mark as cancelled
        pickup.status = 'cancelled';
        await pickup.save();

        res.json({ message: 'Pickup cancelled' });
    } catch (error) {
        console.error('Delete pickup error:', error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
});

export default router;
