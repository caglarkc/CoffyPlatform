const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    permissions: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Permission',
        default: []
    }
}, { timestamps: true });

module.exports = mongoose.model('Role', roleSchema);

