const mongoose = require('mongoose');
const LocationSchema = require('./LocationSchema');

const FarmSchema = new mongoose.Schema({
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
    name: { type: String, required: true },
    location: LocationSchema,
    description: String,
});

FarmSchema.index({ location: '2dsphere' });

FarmSchema.virtual('greenhouses', {
    ref: 'Greenhouse',
    localField: '_id',
    foreignField: 'farm'
});

module.exports = mongoose.model('Farm', FarmSchema);
