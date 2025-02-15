import mongoose from 'mongoose';

const organizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  settings: {
    appointmentDuration: {
      type: Number,
      default: 30,
      min: 15
    }
  }
}, {
  timestamps: true
});

export const Organization = mongoose.model('Organization', organizationSchema); 