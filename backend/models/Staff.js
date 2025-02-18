import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
  },
  role: {
    type: String,
    enum: ['admin', 'staff'],
    default: 'staff'
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  services: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  }]
}, {
  timestamps: true
});

// Ensure email is unique within an organization
// staffSchema.index({ email: 1, organization: 1 }, { unique: true });

export const Staff = mongoose.model('Staff', staffSchema); 