const express = require('express');
const router = express.Router();
const restify = require('express-restify-mongoose');
const Bed = require('../models/Bed');
const Greenhouse = require('../models/Greenhouse');
const { authenticate } = require('../middleware/auth');
const { handleSchemaRequest } = require('../controllers/schemaController');

router.get('/bed/schema', authenticate, handleSchemaRequest(Bed, {
    greenhouse: { model: Greenhouse }
}));

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
