const express = require('express');
const router = express.Router();
const restify = require('express-restify-mongoose');
const Measurement = require('../models/Measurement');
const User = require('../models/User');
const Phytopathogen = require('../models/Phytopathogen');
const Bed = require('../models/Bed');
const { authenticate } = require('../middleware/auth');
const { handleSchemaRequest } = require('../controllers/schemaController');

router.get('/measurement/schema', authenticate, handleSchemaRequest(Measurement, {
    user: { model: User },
    pathogen: { model: Phytopathogen },
    bed: { model: Bed }
}));

restify.serve(router, Measurement, {
    prefix: '',
    version: '',
    runValidators: true,
    lean: true,
    findOneAndUpdate: false,
    findOneAndRemove: false,
    preMiddleware: authenticate,
    select: '-password -__v',
    modelDescriptions: true,
    populate: [
        {
            path: 'user',
            select: '-password -__v'
        },
        {
            path: 'pathogen',
            select: '-__v'
        },
        {
            path: 'bed',
            select: '-__v',
            populate: {
                path: 'greenhouse',
                select: '-__v',
                populate: {
                    path: 'farm',
                    select: '-__v'
                }
            }
        }
    ],
});

module.exports = router;
