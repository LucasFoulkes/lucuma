const express = require('express');
const router = express.Router();
const restify = require('express-restify-mongoose');
const Farm = require('../models/Farm');
const Organization = require('../models/Organization');
const { authenticate } = require('../middleware/auth');
const { handleSchemaRequest } = require('../controllers/schemaController');

router.get('/farm/schema', authenticate, handleSchemaRequest(Farm, {
    organization: { model: Organization }
}));

restify.serve(router, Farm, {
    prefix: '',
    version: '',
    runValidators: true,
    lean: true,
    findOneAndUpdate: false,
    findOneAndRemove: false,
    preMiddleware: authenticate,
    select: '-__v',
    populate: [
        {
            path: 'organization',
            select: '-__v'
        }
    ],
    onError: (err, req, res, next) => {
        console.error('Farm route error:', err);
        res.status(400).json({
            error: err.message || 'An error occurred'
        });
    }
});

module.exports = router;
