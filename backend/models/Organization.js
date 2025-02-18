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
    },
    weeklySchedule: {
      monday: {
        start: { type: String, default: '09:00' },
        end: { type: String, default: '17:00' }
      },
      tuesday: {
        start: { type: String, default: '09:00' },
        end: { type: String, default: '17:00' }
      },
      wednesday: {
        start: { type: String, default: '09:00' },
        end: { type: String, default: '17:00' }
      },
      thursday: {
        start: { type: String, default: '09:00' },
        end: { type: String, default: '17:00' }
      },
      friday: {
        start: { type: String, default: '09:00' },
        end: { type: String, default: '17:00' }
      },
      saturday: {
        start: { type: String, default: '09:00' },
        end: { type: String, default: '17:00' }
      },
      sunday: {
        start: { type: String, default: '09:00' },
        end: { type: String, default: '17:00' }
      }
    }
  }
}, {
  timestamps: true
});

export const Organization = mongoose.model('Organization', organizationSchema); 