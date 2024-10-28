const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
    nombres: { type: String, required: true },
    apellido_paterno: { type: String, required: true },
    apellido_materno: String,
    email: { type: String, required: true, unique: true },
    telefono: String,
    direccion: String,
    ciudad: String,
    pais: String,
    cedula: String,
    notas: String
}, {
    timestamps: true
});

ContactSchema.virtual('user', {
    ref: 'User',
    localField: '_id',
    foreignField: 'contact',
});

module.exports = mongoose.model('Contact', ContactSchema);
