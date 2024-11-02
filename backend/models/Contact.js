const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
    country: { type: String },
    title: { type: String },
    notes: { type: String },
    tags: { type: [String] },
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);
