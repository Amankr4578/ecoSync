import mongoose from 'mongoose';

const pickupSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    wasteType: {
        type: String,
        required: [true, 'Please select a waste type'],
        enum: ['recyclable', 'organic', 'ewaste', 'hazardous']
    },
    date: {
        type: Date,
        required: [true, 'Please select a date']
    },
    time: {
        type: String,
        required: [true, 'Please select a time']
    },
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    estimatedWeight: {
        type: Number,
        default: 0
    },
    actualWeight: {
        type: Number,
        default: 0
    },
    notes: {
        type: String,
        default: ''
    },
    adminNotes: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['pending', 'scheduled', 'in-progress', 'completed', 'cancelled'],
        default: 'pending'
    },
    pickupId: {
        type: String,
        unique: true
    },
    ecoPointsEarned: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    completedAt: {
        type: Date
    }
});

// Generate pickup ID before saving
pickupSchema.pre('save', async function() {
    if (!this.pickupId) {
        const year = new Date().getFullYear();
        const count = await mongoose.model('Pickup').countDocuments();
        this.pickupId = `#ECO-${year}-${String(count + 1).padStart(3, '0')}`;
    }
});

// Calculate eco points based on waste type and weight
pickupSchema.methods.calculateEcoPoints = function() {
    const pointsPerKg = {
        recyclable: 10,
        organic: 5,
        ewaste: 20,
        hazardous: 15
    };
    return Math.round(this.actualWeight * (pointsPerKg[this.wasteType] || 5));
};

const Pickup = mongoose.model('Pickup', pickupSchema);

export default Pickup;
