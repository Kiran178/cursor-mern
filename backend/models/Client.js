import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: false,
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
  preferredDaysServices: [{
    day: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      required: true
    },
    services: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true
    }]
  }],
  monthlySlotAllocation: [{
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true
    },
    slots: {
      type: Number,
      required: true,
      min: 1,
      default: 10
    }
  }],
  preferredDays: [{
    type: String,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  }],
  preferredServices: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  }]
}, {
  timestamps: true
});

// Remove the problematic index on email and organization
// clientSchema.index({ email: 1, organization: 1 }, { unique: true, sparse: true });

// Ensure phone is unique within an organization
clientSchema.index({ phone: 1, organization: 1 }, { unique: true });

// Add a pre-save hook to validate email uniqueness only if email is provided
clientSchema.pre('save', async function(next) {
  // Skip validation if email is not provided
  if (!this.email) {
    return next();
  }
  
  const Client = this.constructor;
  
  // Check if there's another client with the same email in the same organization
  const existingClient = await Client.findOne({
    email: this.email,
    organization: this.organization,
    _id: { $ne: this._id } // Exclude current client when updating
  });
  
  if (existingClient) {
    return next(new Error('Email already exists for another client in this organization'));
  }
  
  next();
});

// Add a pre-update hook to validate email uniqueness
clientSchema.pre('findOneAndUpdate', async function(next) {
  const update = this.getUpdate();
  
  // Skip validation if email is not being updated or is being unset
  if (!update.email || update.$unset?.email) {
    return next();
  }
  
  const Client = mongoose.model('Client');
  const filter = this.getFilter();
  
  // Check if there's another client with the same email in the same organization
  const existingClient = await Client.findOne({
    email: update.email,
    organization: filter.organization,
    _id: { $ne: filter._id } // Exclude current client
  });
  
  if (existingClient) {
    return next(new Error('Email already exists for another client in this organization'));
  }
  
  next();
});

export const Client = mongoose.model('Client', clientSchema); 