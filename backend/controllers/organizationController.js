const Organization = require('../models/Organization');

// Get all organizations
const getAllOrganizations = async (req, res) => {
    try {
        const organizations = await Organization.find();
        res.json(organizations);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching organizations' });
    }
};

// Get single organization by ID
const getOrganization = async (req, res) => {
    try {
        const organization = await Organization.findById(req.params.id);
        if (!organization) {
            return res.status(404).json({ error: 'Organization not found' });
        }
        res.json(organization);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching organization' });
    }
};

// Create new organization(s)
const createOrganization = async (req, res) => {
    try {
        // Check if the request body is an array
        if (Array.isArray(req.body)) {
            const organizations = await Organization.insertMany(req.body);
            return res.status(201).json(organizations);
        }

        // Handle single organization creation
        const organization = new Organization(req.body);
        await organization.save();
        res.status(201).json(organization);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update organization
const updateOrganization = async (req, res) => {
    try {
        const organization = await Organization.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!organization) {
            return res.status(404).json({ error: 'Organization not found' });
        }
        res.json(organization);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete organization (soft delete)
const deleteOrganization = async (req, res) => {
    try {
        const organization = await Organization.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );
        if (!organization) {
            return res.status(404).json({ error: 'Organization not found' });
        }
        res.json({ message: 'Organization deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting organization' });
    }
};

module.exports = {
    getAllOrganizations,
    getOrganization,
    createOrganization,
    updateOrganization,
    deleteOrganization
};
