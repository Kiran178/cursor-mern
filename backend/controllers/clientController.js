import { Client } from '../models/Client.js';
import { User } from '../models/User.js';

// Helper function to check if user has required role
const hasRequiredRole = (role) => {
  return ['superadmin', 'admin'].includes(role);
};

export const createClient = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    // Check if user is superadmin or admin
    if (!hasRequiredRole(user.role)) {
      return res.status(403).json({ 
        message: 'Only superadmin and admin can create clients' 
      });
    }

    if (!user.organization) {
      return res.status(400).json({ message: 'No organization selected' });
    }

    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      address, 
      notes,
      preferredStaff 
    } = req.body;

    const client = new Client({
      firstName,
      lastName,
      email,
      phone,
      address,
      notes,
      preferredStaff,
      organization: user.organization
    });

    await client.save();
    await client.populate('preferredStaff');

    res.status(201).json({
      message: 'Client created successfully',
      client
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'A client with this email or phone already exists in this organization' 
      });
    }
    res.status(500).json({ message: 'Error creating client', error: error.message });
  }
};

export const getClients = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const clients = await Client.find({ organization: user.organization })
      .populate('preferredStaff', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching clients', error: error.message });
  }
};

export const updateClient = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    // Check if user is superadmin or admin
    if (!hasRequiredRole(user.role)) {
      return res.status(403).json({ 
        message: 'Only superadmin and admin can update clients' 
      });
    }

    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      address, 
      status,
      notes,
      preferredStaff 
    } = req.body;
    
    const client = await Client.findOne({
      _id: req.params.id,
      organization: user.organization
    });

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    client.firstName = firstName || client.firstName;
    client.lastName = lastName || client.lastName;
    client.email = email || client.email;
    client.phone = phone || client.phone;
    client.address = address || client.address;
    client.status = status || client.status;
    client.notes = notes || client.notes;
    client.preferredStaff = preferredStaff || client.preferredStaff;

    await client.save();
    await client.populate('preferredStaff', 'firstName lastName');

    res.json({
      message: 'Client updated successfully',
      client
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'A client with this email or phone already exists in this organization' 
      });
    }
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