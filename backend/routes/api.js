const express = require('express');
const router = express.Router();
const organizationRoutes = require('./organizationRoutes');

// Mount the restify-generated routes
router.use(organizationRoutes);

router.get('/', (req, res) => {
    res.json({ message: 'API is working!' });
});

module.exports = router;
