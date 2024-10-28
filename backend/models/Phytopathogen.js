const mongoose = require('mongoose');

const PhytopathogenSchema = new mongoose.Schema({
    name: { type: String },
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
});

module.exports = mongoose.model('Phytopathogen', PhytopathogenSchema);
