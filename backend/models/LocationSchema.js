const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Point', 'Polygon'],
        required: true
    },
    coordinates: {
        type: Array,
        required: true
    }
}, {
    _id: false,
    validateBeforeSave: false
});

LocationSchema.pre('validate', function (next) {
    if (!this.type && !this.coordinates?.length) {
        this.type = undefined;
        this.coordinates = undefined;
        return next();
    }
    next();
});

module.exports = LocationSchema;