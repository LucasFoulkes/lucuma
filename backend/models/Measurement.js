const mongoose = require('mongoose');
const LocationSchema = require('./LocationSchema');

const MeasurementSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bed: { type: mongoose.Schema.Types.ObjectId, ref: 'Bed', required: true },
    pathogen: { type: mongoose.Schema.Types.ObjectId, ref: 'Phytopathogen', required: true },
    parte_afectada: {
        type: String,
        required: true
    },
    values: [{
        attribute: { type: String, required: true },
        value: { type: mongoose.Schema.Types.Mixed, required: true }
    }],
    date: { type: Date, default: Date.now, required: true },
    location: LocationSchema,
    weather_conditions: {
        luminosity: Number,
        air_temperature: Number,
        soil_temperature: Number,
        air_humidity: Number,
        soil_humidity: Number,
    },
    notes: String,
}, {
    timestamps: true,
});

MeasurementSchema.index({ bed: 1, date: -1 });
MeasurementSchema.index({ pathogen: 1, date: -1 });
MeasurementSchema.index({ location: '2dsphere' });
MeasurementSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Measurement', MeasurementSchema);
