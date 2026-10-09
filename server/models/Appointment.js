const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true
    },
    appointmentDate: {
      type: String, // Stored as "YYYY-MM-DD"
      required: [true, 'Appointment date is required']
    },
    appointmentTime: {
      type: String, // Stored as "HH:mm" e.g., "10:30"
      required: [true, 'Appointment time is required']
    },
    reason: {
      type: String,
      required: [true, 'Reason for appointment is required'],
      trim: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'Rejected'],
      default: 'Pending'
    },
    adminNotes: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

// Compound Index to prevent double booking active slots
appointmentSchema.index(
  { doctorId: 1, appointmentDate: 1, appointmentTime: 1 },
  { unique: true, partialFilterExpression: { status: { $in: ['Pending', 'Confirmed'] } } }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
