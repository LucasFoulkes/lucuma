const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Organization name is required'],
        trim: true,
        unique: true
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    ruc: {
        type: String,
        trim: true,
        default: ''
    }
});

const Organization = mongoose.model('Organization', organizationSchema);

module.exports = Organization;
