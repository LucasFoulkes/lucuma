const express = require('express');
const router = express.Router();
const restify = require('express-restify-mongoose');
const Bed = require('../models/Bed');
const { authenticate } = require('../middleware/auth');

// Add route to get schema
router.get('/bed/schema', authenticate, (req, res) => {
    const schemaDefinition = Bed.schema.obj;
    res.json({
        schema: schemaDefinition,
        modelName: Bed.modelName
    });
});


restify.serve(router, Bed, {
    prefix: '',
    version: '',
    runValidators: true,
    lean: true,
    findOneAndUpdate: false,
    findOneAndRemove: false,
    preMiddleware: authenticate,
    select: '-__v',
    onError: (err, req, res, next) => {
        console.error('Bed route error:', err);
        res.status(400).json({
            error: err.message || 'An error occurred'
        });
    }
});

module.exports = router;
