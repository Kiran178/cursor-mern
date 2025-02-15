import { Service } from '../models/Service.js';
import { User } from '../models/User.js';

// Helper function to check if user has required role
const hasRequiredRole = (role) => {
  return ['superadmin', 'admin'].includes(role);
};

export const createService = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    // Check if user is superadmin or admin
    if (!hasRequiredRole(user.role)) {
      return res.status(403).json({ 
        message: 'Only superadmin and admin can create services' 
      });
    }

    const { name, description, price, duration } = req.body;

    if (!user.organization) {
      return res.status(400).json({ message: 'No organization selected' });
    }

    const service = new Service({
      name,
      description,
      price,
      duration,
      organization: user.organization
    });

    await service.save();

    res.status(201).json({
      message: 'Service created successfully',
      service
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Service name already exists in this organization' });
    }
    res.status(500).json({ message: 'Error creating service', error: error.message });
  }
};

export const getServices = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const services = await Service.find({ organization: user.organization })
      .sort({ createdAt: -1 });

    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching services', error: error.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    // Check if user is superadmin or admin
    if (!hasRequiredRole(user.role)) {
      return res.status(403).json({ 
        message: 'Only superadmin and admin can update services' 
      });
    }

    const { name, description, price, duration, status } = req.body;
    
    const service = await Service.findOne({
      _id: req.params.id,
      organization: user.organization
    });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    service.name = name || service.name;
    service.description = description || service.description;
    service.price = price || service.price;
    service.duration = duration || service.duration;
    service.status = status || service.status;

    await service.save();

    res.json({
      message: 'Service updated successfully',
      service
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Service name already exists in this organization' });
    }
    res.status(500).json({ message: 'Error updating service', error: error.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    // Check if user is superadmin or admin
    if (!hasRequiredRole(user.role)) {
      return res.status(403).json({ 
        message: 'Only superadmin and admin can delete services' 
      });
    }

    const service = await Service.findOneAndDelete({
      _id: req.params.id,
      organization: user.organization
    });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting service', error: error.message });
  }
}; 