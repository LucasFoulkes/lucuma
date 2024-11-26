const mongoose = require('mongoose');
const LocationSchema = require('./LocationSchema');

const FarmSchema = new mongoose.Schema({
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
    name: { type: String, required: true },
    location: {
        type: LocationSchema,
        default: null,
        required: false
    },
    description: String,
}, {
    timestamps: true
});

// Only create the 2dsphere index if location exists and has valid GeoJSON
FarmSchema.pre('save', function (next) {
    if (!this.location || !this.location.type) {
        this.location = null;
    }
    next();
});

// Create a sparse index so it only indexes documents with valid location data
FarmSchema.index({ location: '2dsphere' }, { sparse: true });

FarmSchema.virtual('greenhouses', {
    ref: 'Greenhouse',
    localField: '_id',
    foreignField: 'farm'
});

module.exports = mongoose.model('Farm', FarmSchema);
