const express = require('express');
const router = express.Router();
const organizationController = require('../controllers/organizationController');

// Organization routes
router.get('/', organizationController.getAllOrganizations);
router.get('/:id', organizationController.getOrganization);
router.post('/', organizationController.createOrganization);
router.put('/:id', organizationController.updateOrganization);
router.delete('/:id', organizationController.deleteOrganization);

module.exports = router;
