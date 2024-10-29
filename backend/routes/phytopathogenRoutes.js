const express = require('express');
const router = express.Router();
const restify = require('express-restify-mongoose');
const Phytopathogen = require('../models/Phytopathogen');
const { authenticate } = require('../middleware/auth');

// Add route to get schema
router.get('/phytopathogen/schema', authenticate, (req, res) => {
    const schemaDefinition = Phytopathogen.schema.obj;
    res.json({
        schema: schemaDefinition,
        modelName: Phytopathogen.modelName
    });
});


restify.serve(router, Phytopathogen, {
    prefix: '',
    version: '',
    runValidators: true,
    lean: true,
    findOneAndUpdate: false,
    findOneAndRemove: false,
    preMiddleware: authenticate,
    select: '-__v',
    onError: (err, req, res, next) => {
        console.error('Phytopathogen route error:', err);
        res.status(400).json({
            error: err.message || 'An error occurred'
        });
    }
});

module.exports = router;
