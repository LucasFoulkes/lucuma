const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Point', 'Polygon', 'LineString', 'MultiPoint', 'MultiLineString', 'MultiPolygon'],
        required: true
    },
    coordinates: {
        type: Array,
        required: true
    },
    properties: {
        type: {
            radius: Number,
            isCircle: Boolean
        },
        required: false
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

LocationSchema.pre('validate', function (next) {
    if (this.properties?.isCircle) {
        if (!Array.isArray(this.coordinates) ||
            this.coordinates.length !== 2 ||
            typeof this.properties.radius !== 'number') {
            next(new Error('Circle must have coordinates [longitude, latitude] and radius in properties'));
            return;
        }
        this.type = 'Point';
    }
    next();
});

const GreenhouseSchema = new mongoose.Schema({
    farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
    name: { type: String, required: true },
    location: LocationSchema,
    description: String,
}, {
    timestamps: true
});

GreenhouseSchema.index({ location: '2dsphere' });

GreenhouseSchema.virtual('beds', {
    ref: 'Bed',
    localField: '_id',
    foreignField: 'greenhouse'
});

module.exports = mongoose.model('Greenhouse', GreenhouseSchema);
