const express = require('express');
const router = express.Router();

const organizationRoutes = require('./organizationRoutes');
const userRoutes = require('./userRoutes');
const contactRoutes = require('./contactRoutes');
const farmRoutes = require('./farmRoutes');
const greenhouseRoutes = require('./greenhouseRoutes');
const bedRoutes = require('./bedRoutes');
const phytopathogenRoutes = require('./phytopathogenRoutes');
const measurementRoutes = require('./measurementRoutes');
const authRoutes = require('./authRoutes');

router.use(authRoutes);
router.use(organizationRoutes);
router.use(userRoutes);
router.use(contactRoutes);
router.use(farmRoutes);
router.use(greenhouseRoutes);
router.use(bedRoutes);
router.use(phytopathogenRoutes);
router.use(measurementRoutes);

module.exports = router;
