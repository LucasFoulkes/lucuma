const express = require('express');
const router = express.Router();
const restify = require('express-restify-mongoose');
const User = require('../models/User');
const Organization = require('../models/Organization');
const Contact = require('../models/Contact');
const { authenticate } = require('../middleware/auth');
const { handleSchemaRequest } = require('../controllers/schemaController');

router.get('/user/schema', authenticate, handleSchemaRequest(User, {
    organization: { model: Organization },
    contact: { model: Contact }
}));

restify.serve(router, User, {
    prefix: '',
    version: '',
    runValidators: true,
    lean: true,
    findOneAndUpdate: false,
    findOneAndRemove: false,
    preMiddleware: authenticate,
    select: '-__v -password',
    populate: [
        {
            path: 'organization',
            select: '-__v'
        },
        {
            path: 'contact',
            select: '-__v'
        }
    ]
});

module.exports = router;
