import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
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
  notes: {
    type: String
  },
  preferredStaff: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff'
  }]
}, {
  timestamps: true
});

// Ensure email is unique within an organization
clientSchema.index({ email: 1, organization: 1 }, { unique: true });
// Ensure phone is unique within an organization
clientSchema.index({ phone: 1, organization: 1 }, { unique: true });

export const Client = mongoose.model('Client', clientSchema); 