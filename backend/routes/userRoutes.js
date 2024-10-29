const express = require('express');
const router = express.Router();
const restify = require('express-restify-mongoose');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

router.get('/user/schema', authenticate, (req, res) => {
    const schemaDefinition = User.schema.obj;
    res.json({
        schema: schemaDefinition,
        modelName: User.modelName
    });
});



restify.serve(router, User, {
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
            path: 'organization',
            select: '-__v'
        },
        {
            path: 'contact',
            select: '-__v'
        }
    ],
});

module.exports = router;
