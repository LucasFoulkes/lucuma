const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Organization name is required'],
    },
    description: {
        type: String,
    },
    ruc: {
        type: String,
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

const Organization = mongoose.model('Organization', organizationSchema);

module.exports = Organization;
