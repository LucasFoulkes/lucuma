const express = require('express');
const router = express.Router();
const restify = require('express-restify-mongoose');
const Contact = require('../models/Contact');
const Organization = require('../models/Organization');
const { authenticate } = require('../middleware/auth');
const { handleSchemaRequest } = require('../controllers/schemaController');

router.get('/contact/schema', authenticate, handleSchemaRequest(Contact, {
    organization: { model: Organization }
}));

restify.serve(router, Contact, {
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
        console.error('Contact route error:', err);
        res.status(400).json({
            error: err.message || 'An error occurred'
        });
    }
});

module.exports = router;
