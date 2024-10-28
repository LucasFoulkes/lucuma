const mongoose = require('mongoose');
const LocationSchema = require('./LocationSchema');

const BedSchema = new mongoose.Schema({
    greenhouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Greenhouse', required: true },
    name: { type: String, required: true },
    location: LocationSchema,

});

BedSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Bed', BedSchema);
