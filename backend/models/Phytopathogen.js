const mongoose = require('mongoose');

const PhytopathogenSchema = new mongoose.Schema({
    name: { type: String, required: true },
    scientificName: { type: String },
    description: String,
    attributes: [{
        name: { type: String },
        type: { type: String, enum: ['Number', 'String', 'Boolean'] },
        unit: String,
        range: {
            min: Number,
            max: Number
        }
    }]
}, {
    timestamps: true  // Added timestamps
});

module.exports = mongoose.model('Phytopathogen', PhytopathogenSchema);
