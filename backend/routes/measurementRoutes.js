const express = require('express');
const router = express.Router();
const restify = require('express-restify-mongoose');
const Measurement = require('../models/Measurement');
const { authenticate } = require('../middleware/auth');

restify.serve(router, Measurement, {
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
            path: 'user',
            select: '-password -__v'
        }
    ],
    onError: (err, req, res, next) => {
        console.error('Measurement route error:', err);
        res.status(400).json({
            error: err.message || 'An error occurred'
        });
    }
});

module.exports = router;
