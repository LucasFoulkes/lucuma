const express = require('express');
const router = express.Router();
const organizationRoutes = require('./organizationRoutes');

router.use('/organizations', organizationRoutes);

router.get('/', (req, res) => {
    res.json({ message: 'API is working!' });
});

module.exports = router;
