const mongoose = require('mongoose');
const { getAuthConnection } = require('../utils/mongooseConnections');

// Auth veritabanı için mongoose bağlantısını al
const authConn = getAuthConnection();

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        required: true
    },
    location: {
        region: { type: String, default: null },
        city: { type: String, default: null },
        district: { type: String, default: null },
        storeId: { type: String, default: null },
    },
    whoCreate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        default: null
    },
    status: {
        type: String,
        enum: ['active', 'blocked', 'deleted'],
        default: 'active'
    },
    isLoggedIn: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Auth veritabanı bağlantısını kullan
module.exports = authConn.model('Admin', adminSchema);


