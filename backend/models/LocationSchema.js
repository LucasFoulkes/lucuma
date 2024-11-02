const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: [
            'Point',
            'Circle',
            'Polygon',
            'LineString',
            'MultiPoint',
            'MultiLineString',
            'MultiPolygon',
            'GeometryCollection'
        ],
        required: true
    },
    coordinates: {
        type: Array,
        required: function () {
            return this.type !== 'GeometryCollection';
        }
    },
    radius: {
        type: Number,
        required: function () {
            return this.type === 'Circle';
        }
    },
    geometries: {
        type: Array,
        required: function () {
            return this.type === 'GeometryCollection';
        }
    }
});

// Add validation at the schema level
LocationSchema.pre('validate', function (next) {
    if (this.type === 'Circle') {
        if (!Array.isArray(this.coordinates) ||
            this.coordinates.length !== 2 ||
            typeof this.radius !== 'number') {
            next(new Error('Circle type must have coordinates [longitude, latitude] and radius'));
            return;
        }
    }
    next();
});

module.exports = LocationSchema;
