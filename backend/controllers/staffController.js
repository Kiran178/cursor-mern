import { Staff } from '../models/Staff.js';
import { User } from '../models/User.js';

// Helper function to check if user has required role
const hasRequiredRole = (role) => {
  return ['superadmin', 'admin'].includes(role);
};

export const createStaff = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    // Check if user is superadmin or admin
    if (!hasRequiredRole(user.role)) {
      return res.status(403).json({ 
        message: 'Only superadmin and admin can create staff' 
      });
    }

    const { firstName, lastName, email, phone, services } = req.body;

    if (!user.organization) {
      return res.status(400).json({ message: 'No organization selected' });
    }

    const staff = new Staff({
      firstName,
      lastName,
      email,
      phone,
      role: 'staff',
      organization: user.organization,
      services: services || []
    });

    await staff.save();
    await staff.populate('services');

    res.status(201).json({
      message: 'Staff created successfully',
      staff
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists in this organization' });
    }
    res.status(500).json({ message: 'Error creating staff', error: error.message });
  }
};

export const getStaffs = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const staffs = await Staff.find({ organization: user.organization })
      .populate('services')
      .sort({ createdAt: -1 });

    res.json(staffs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching staffs', error: error.message });
  }
};

export const updateStaff = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    // Check if user is superadmin or admin
    if (!hasRequiredRole(user.role)) {
      return res.status(403).json({ 
        message: 'Only superadmin and admin can update staff' 
      });
    }

    const { firstName, lastName, email, phone, role, status, services } = req.body;
    
    const staff = await Staff.findOne({
      _id: req.params.id,
      organization: user.organization
    });

    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    // Only allow role updates if the user is a superadmin
    if (role && role !== staff.role) {
      if (user.role !== 'superadmin') {
        return res.status(403).json({ message: 'Only superadmin can change staff roles' });
      }
      // Ensure role is either 'staff' or 'admin'
      if (!['staff', 'admin'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role. Must be either staff or admin' });
      }
    }

    staff.firstName = firstName || staff.firstName;
    staff.lastName = lastName || staff.lastName;
    staff.email = email || staff.email;
    staff.phone = phone || staff.phone;
    staff.role = role || staff.role;
    staff.status = status || staff.status;
    staff.services = services || staff.services;

    await staff.save();

    res.json({
      message: 'Staff updated successfully',
      staff
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists in this organization' });
    }
    res.status(500).json({ message: 'Error updating staff', error: error.message });
  }
};

export const deleteStaff = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    // Check if user is superadmin or admin
    if (!hasRequiredRole(user.role)) {
      return res.status(403).json({ 
        message: 'Only superadmin and admin can delete staff' 
      });
    }

    const staff = await Staff.findOneAndDelete({
      _id: req.params.id,
      organization: user.organization
    });

    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    res.json({ message: 'Staff deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting staff', error: error.message });
  }
}; 