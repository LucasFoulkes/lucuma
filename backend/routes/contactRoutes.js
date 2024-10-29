const express = require('express');
const router = express.Router();
const restify = require('express-restify-mongoose');
const Contact = require('../models/Contact');
const { authenticate } = require('../middleware/auth');



// Add route to get schema
router.get('/contact/schema', authenticate, (req, res) => {
    const schemaDefinition = Contact.schema.obj;
    res.json({
        schema: schemaDefinition,
        modelName: Contact.modelName
    });
});



restify.serve(router, Contact, {
    prefix: '',
    version: '',
    runValidators: true,
    lean: true,
    findOneAndUpdate: false,
    findOneAndRemove: false,
    preMiddleware: authenticate,
    select: '-__v',
    onError: (err, req, res, next) => {
        console.error('Contact route error:', err);
        res.status(400).json({
            error: err.message || 'An error occurred'
        });
    }
});

module.exports = router;
