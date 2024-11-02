const express = require('express');
const router = express.Router();
const restify = require('express-restify-mongoose');
const Greenhouse = require('../models/Greenhouse');
const Farm = require('../models/Farm');
const { authenticate } = require('../middleware/auth');
const { handleSchemaRequest } = require('../controllers/schemaController');

router.get('/greenhouse/schema', authenticate, handleSchemaRequest(Greenhouse, {
    farm: { model: Farm }
}));

restify.serve(router, Greenhouse, {
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
            path: 'farm',
            select: '-__v'
        }
    ],
    onError: (err, req, res, next) => {
        console.error('Greenhouse route error:', err);
        res.status(400).json({
            error: err.message || 'An error occurred'
        });
    }
});

module.exports = router;
