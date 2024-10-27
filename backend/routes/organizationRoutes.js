const express = require('express');
const router = express.Router();
const restify = require('express-restify-mongoose');
const Organization = require('../models/Organization');

// Configure express-restify-mongoose
restify.serve(router, Organization, {
    prefix: '',  // Since we're already under /api/organizations
    version: '',  // We don't need additional versioning
    runValidators: true,  // Run model validators on PUT/POST
    lean: true,  // Return plain objects instead of Mongoose documents
    findOneAndUpdate: false,  // Use findOneAndUpdate for PUT requests
    findOneAndRemove: false,  // Use findOneAndRemove for DELETE requests
    // Optional: Add access control
    preMiddleware: (req, res, next) => {
        // You can add authentication/authorization here
        next();
    },
    // Optional: Add custom error handling
    onError: (err, req, res, next) => {
        console.error(err);
        res.status(400).json({
            error: err.message || 'An error occurred'
        });
    }
});

module.exports = router;
