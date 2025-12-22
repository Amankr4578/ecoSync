import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema({
    // This ensures only one settings document exists
    key: {
        type: String,
        default: 'main',
        unique: true
    },
    // Homepage Impact Stats
    impactStats: {
        tonsProcessed: {
            value: { type: String, default: '50,240' },
            subtext: { type: String, default: '+12% this month' }
        },
        globalUptime: {
            value: { type: String, default: '99.99%' },
            subtext: { type: String, default: 'Uninterrupted service' }
        },
        collectionPoints: {
            value: { type: String, default: '12,405' },
            subtext: { type: String, default: 'Expanding network' }
        },
        carbonOffset: {
            value: { type: String, default: '-450T' },
            subtext: { type: String, default: 'Net negative impact' }
        }
    },
    // Hero section content (optional for future use)
    hero: {
        tagline: { type: String, default: 'WASTE MANAGEMENT SYSTEM' },
        title: { type: String, default: 'RETHINK WASTE' },
        subtitle: { type: String, default: 'EMBRACE ZERO' }
    },
    // Contact/Company info
    contact: {
        email: { type: String, default: 'contact@ecosync.com' },
        phone: { type: String, default: '+1 (555) 123-4567' },
        address: { type: String, default: '123 Green Street, Eco City' }
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Pre-save hook to update timestamp
siteSettingsSchema.pre('save', function() {
    this.updatedAt = new Date();
});

const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);

export default SiteSettings;
