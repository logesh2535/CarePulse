const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
  dayOfWeek: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true
  },
  startTime: { type: String, required: true }, // e.g., "09:00"
  endTime: { type: String, required: true },   // e.g., "17:00"
  slotDurationMinutes: { type: Number, default: 30 },
  isAvailable: { type: Boolean, default: true }
});

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    specialization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Specialization',
      required: [true, 'Specialization is required']
    },
    qualification: {
      type: String,
      required: [true, 'Qualification is required'],
      trim: true
    },
    experience: {
      type: Number,
      required: [true, 'Years of experience required'],
      min: [0, 'Experience cannot be negative']
    },
    consultationFee: {
      type: Number,
      required: [true, 'Consultation fee required'],
      min: [0, 'Fee cannot be negative']
    },
    description: {
      type: String,
      default: ''
    },
    profileImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80'
    },
    availability: [timeSlotSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Doctor', doctorSchema);
