const mongoose = require('mongoose');
const LocationSchema = require('./LocationSchema');

const GreenhouseSchema = new mongoose.Schema({
    farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
    name: { type: String, required: true },
    location: LocationSchema,
    description: String,
});

GreenhouseSchema.index({ location: '2dsphere' });
GreenhouseSchema.index({ farm: 1, name: 1 }, { unique: true });

GreenhouseSchema.virtual('beds', {
    ref: 'Bed',
    localField: '_id',
    foreignField: 'greenhouse'
});

module.exports = mongoose.model('Greenhouse', GreenhouseSchema);