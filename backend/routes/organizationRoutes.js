const express = require('express');
const router = express.Router();
const restify = require('express-restify-mongoose');
const Organization = require('../models/Organization');
const { authenticate } = require('../middleware/auth');
const { handleSchemaRequest } = require('../controllers/schemaController');

router.get('/organization/schema', authenticate, handleSchemaRequest(Organization));

restify.serve(router, Organization, {
    prefix: '',
    version: '',
    runValidators: true,
    lean: true,
    findOneAndUpdate: false,
    findOneAndRemove: false,
    preMiddleware: authenticate,
    select: '-__v',
    onError: (err, req, res, next) => {
        console.error('Organization route error:', err);
        res.status(400).json({
            error: err.message || 'An error occurred'
        });
    }
});

module.exports = router;
