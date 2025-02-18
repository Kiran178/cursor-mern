import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
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
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
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
    ref: 'Staff',
    required: true
  }],
  priorityScore: {
    type: Number,
    min: 1,
    max: 10,
    default: 10
  },
  preferredDays: [{
    type: String,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    required: true
  }]
}, {
  timestamps: true
});

// Ensure email is unique within an organization
clientSchema.index({ email: 1, organization: 1 }, { unique: true });
// Ensure phone is unique within an organization
clientSchema.index({ phone: 1, organization: 1 }, { unique: true });

export const Client = mongoose.model('Client', clientSchema); 