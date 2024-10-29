const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: false, unique: true },
    phone: { type: String, required: false },
    address: { type: String, required: false },
    city: { type: String, required: false },
    country: { type: String, required: false },
    idNumber: { type: String, required: false },
    notes: { type: String, required: false }
}, {
    timestamps: true
});

ContactSchema.virtual('user', {
    ref: 'User',
    localField: '_id',
    foreignField: 'contact',
});

module.exports = mongoose.model('Contact', ContactSchema);
