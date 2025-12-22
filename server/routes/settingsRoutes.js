import express from 'express';
import SiteSettings from '../models/SiteSettings.js';
import { adminProtect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/settings
// @desc    Get site settings (public - for frontend)
// @access  Public
router.get('/', async (req, res) => {
    try {
        let settings = await SiteSettings.findOne({ key: 'main' });
        
        // Create default settings if none exist
        if (!settings) {
            settings = await SiteSettings.create({ key: 'main' });
        }

        res.json(settings);
    } catch (error) {
        console.error('Get settings error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/settings
// @desc    Update site settings
// @access  Admin only
router.put('/', adminProtect, async (req, res) => {
    try {
        const { impactStats, hero, contact } = req.body;

        let settings = await SiteSettings.findOne({ key: 'main' });
        
        if (!settings) {
            settings = new SiteSettings({ key: 'main' });
        }

        // Update impact stats if provided
        if (impactStats) {
            if (impactStats.tonsProcessed) {
                settings.impactStats.tonsProcessed = {
                    ...settings.impactStats.tonsProcessed,
                    ...impactStats.tonsProcessed
                };
            }
            if (impactStats.globalUptime) {
                settings.impactStats.globalUptime = {
                    ...settings.impactStats.globalUptime,
                    ...impactStats.globalUptime
                };
            }
            if (impactStats.collectionPoints) {
                settings.impactStats.collectionPoints = {
                    ...settings.impactStats.collectionPoints,
                    ...impactStats.collectionPoints
                };
            }
            if (impactStats.carbonOffset) {
                settings.impactStats.carbonOffset = {
                    ...settings.impactStats.carbonOffset,
                    ...impactStats.carbonOffset
                };
            }
        }

        // Update hero section if provided
        if (hero) {
            settings.hero = { ...settings.hero, ...hero };
        }

        // Update contact info if provided
        if (contact) {
            settings.contact = { ...settings.contact, ...contact };
        }

        await settings.save();

        res.json(settings);
    } catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/settings/impact-stats
// @desc    Update only impact stats (convenience route)
// @access  Admin only
router.put('/impact-stats', adminProtect, async (req, res) => {
    try {
        const { tonsProcessed, globalUptime, collectionPoints, carbonOffset } = req.body;

        let settings = await SiteSettings.findOne({ key: 'main' });
        
        if (!settings) {
            settings = new SiteSettings({ key: 'main' });
        }

        if (tonsProcessed) {
            settings.impactStats.tonsProcessed = {
                value: tonsProcessed.value || settings.impactStats.tonsProcessed.value,
                subtext: tonsProcessed.subtext || settings.impactStats.tonsProcessed.subtext
            };
        }
        if (globalUptime) {
            settings.impactStats.globalUptime = {
                value: globalUptime.value || settings.impactStats.globalUptime.value,
                subtext: globalUptime.subtext || settings.impactStats.globalUptime.subtext
            };
        }
        if (collectionPoints) {
            settings.impactStats.collectionPoints = {
                value: collectionPoints.value || settings.impactStats.collectionPoints.value,
                subtext: collectionPoints.subtext || settings.impactStats.collectionPoints.subtext
            };
        }
        if (carbonOffset) {
            settings.impactStats.carbonOffset = {
                value: carbonOffset.value || settings.impactStats.carbonOffset.value,
                subtext: carbonOffset.subtext || settings.impactStats.carbonOffset.subtext
            };
        }

        await settings.save();

        res.json(settings.impactStats);
    } catch (error) {
        console.error('Update impact stats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
