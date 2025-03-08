import { Client } from '../models/Client.js';
import { User } from '../models/User.js';

// Helper function to check if user has required role
const hasRequiredRole = (role) => {
  return ['superadmin', 'admin'].includes(role);
};

export const createClient = async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      preferredStaff, 
      preferredDaysServices, 
      monthlySlotAllocation,
      notes,
      status
    } = req.body;
    
    const user = await User.findById(req.user.userId);

    const client = new Client({
      firstName,
      lastName,
      email,
      phone,
      preferredStaff,
      preferredDaysServices,
      monthlySlotAllocation,
      priorityScore: 10,
      notes,
      status: status || 'active',
      organization: user.organization
    });

    await client.save();

    res.status(201).json({
      message: 'Client created successfully',
      client
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating client', error: error.message });
  }
};

export const getClients = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const clients = await Client.find({ organization: user.organization })
      .populate('preferredStaff', 'firstName lastName email status')
      .populate('preferredDaysServices.services', 'name price duration')
      .populate('monthlySlotAllocation.service', 'name price duration')
      .sort({ createdAt: -1 });

    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching clients', error: error.message });
  }
};

export const updateClient = async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      preferredStaff, 
      preferredDaysServices, 
      monthlySlotAllocation,
      notes,
      status
    } = req.body;
    
    const user = await User.findById(req.user.userId);

    const client = await Client.findOneAndUpdate(
      { _id: req.params.id, organization: user.organization },
      { 
        firstName, 
        lastName, 
        email, 
        phone, 
        preferredStaff, 
        preferredDaysServices, 
        monthlySlotAllocation,
        priorityScore: 10,
        notes,
        status
      },
      { new: true }
    )
    .populate('preferredStaff', 'firstName lastName')
    .populate('preferredDaysServices.services', 'name price duration')
    .populate('monthlySlotAllocation.service', 'name price duration');

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.json(client);
  } catch (error) {
    res.status(500).json({ message: 'Error updating client', error: error.message });
  }
};

export const deleteClient = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    // Check if user is superadmin or admin
    if (!hasRequiredRole(user.role)) {
      return res.status(403).json({ 
        message: 'Only superadmin and admin can delete clients' 
      });
    }

    const client = await Client.findOneAndDelete({
      _id: req.params.id,
      organization: user.organization
    });

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting client', error: error.message });
  }
}; 