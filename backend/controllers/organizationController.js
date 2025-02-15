import { Organization } from '../models/Organization.js';
import { User } from '../models/User.js';

export const createOrganization = async (req, res) => {
  try {
    const { name, description } = req.body;

    const existingOrg = await Organization.findOne({ name });
    if (existingOrg) {
      return res.status(400).json({ message: 'Organization already exists' });
    }

    const organization = new Organization({
      name,
      description,
      createdBy: req.user.userId
    });

    await organization.save();

    res.status(201).json({
      message: 'Organization created successfully',
      organization
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating organization', error: error.message });
  }
};

export const getOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.find()
      .populate('createdBy', 'email')
      .sort({ createdAt: -1 });

    res.json(organizations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching organizations', error: error.message });
  }
};

export const getOrganization = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id)
      .populate('createdBy', 'email');

    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    res.json(organization);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching organization', error: error.message });
  }
};

export const updateOrganization = async (req, res) => {
  try {
    const { name, description } = req.body;
    const organization = await Organization.findById(req.params.id);

    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    if (name && name !== organization.name) {
      const existingOrg = await Organization.findOne({ name });
      if (existingOrg) {
        return res.status(400).json({ message: 'Organization name already exists' });
      }
    }

    organization.name = name || organization.name;
    organization.description = description || organization.description;

    await organization.save();

    res.json({
      message: 'Organization updated successfully',
      organization
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating organization', error: error.message });
  }
};

export const deleteOrganization = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id);

    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    await organization.deleteOne();

    res.json({ message: 'Organization deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting organization', error: error.message });
  }
};

export const switchOrganization = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id);
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.organization = organization._id;
    await user.save();

    res.json({ message: 'Organization switched successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error switching organization', error: error.message });
  }
};

export const getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const organization = await Organization.findById(user.organization);
    
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    res.json(organization.settings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching settings', error: error.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!['superadmin', 'admin'].includes(user.role)) {
      return res.status(403).json({ message: 'Only superadmin and admin can update settings' });
    }

    const organization = await Organization.findById(user.organization);
    
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    organization.settings = {
      ...organization.settings,
      ...req.body
    };

    await organization.save();

    res.json(organization.settings);
  } catch (error) {
    res.status(500).json({ message: 'Error updating settings', error: error.message });
  }
}; 