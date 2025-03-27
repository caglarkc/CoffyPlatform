const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    storeId: {
        type: String,
        required: true
    },
    location: {
        region: { type: String, default: null },
        city: { type: String, default: null },
        district: { type: String, default: null }
    },
    workers: {
        type: Array,
        default: []
    },
    status: {
        type: String,
        enum: ['active', 'tempClosed', 'closed'],
        default: 'active'
    }
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);


