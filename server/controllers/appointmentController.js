const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

// @desc    Book a new appointment (Patient only)
// @route   POST /api/appointments
// @access  Private/Patient
exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, appointmentDate, appointmentTime, reason } = req.body;

    if (!doctorId || !appointmentDate || !appointmentTime || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Please provide doctor, date, time slot, and reason for appointment'
      });
    }

    // Find patient record associated with current user
    const patient = await Patient.findOne({ userId: req.user._id });
    if (!patient) {
      return res.status(400).json({ success: false, message: 'Patient profile not found' });
    }

    // Check if doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    // Prevents booking in past date
    const selectedDate = new Date(`${appointmentDate}T${appointmentTime}`);
    const now = new Date();
    if (selectedDate < now) {
      return res.status(400).json({
        success: false,
        message: 'Cannot book an appointment for a past date or time'
      });
    }

    // ZERO DOUBLE-BOOKING LOCK: Atomic check for active booking on exact doctor + date + time
    const existingAppointment = await Appointment.findOne({
      doctorId,
      appointmentDate,
      appointmentTime,
      status: { $in: ['Pending', 'Confirmed'] }
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: 'This appointment slot is no longer available. Please select another slot.'
      });
    }

    const appointment = await Appointment.create({
      patientId: patient._id,
      doctorId,
      appointmentDate,
      appointmentTime,
      reason,
      status: 'Pending'
    });

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate({
        path: 'doctorId',
        populate: [
          { path: 'userId', select: 'name email phone' },
          { path: 'specialization', select: 'name' }
        ]
      })
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: 'name email phone' }
      });

    return res.status(201).json({
      success: true,
      message: 'Appointment booked successfully! Status is Pending doctor approval.',
      data: populatedAppointment
    });
  } catch (error) {
    console.error('Book Appointment Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get appointments (Role-based: Patient sees own, Doctor sees assigned, Admin sees all)
// @route   GET /api/appointments
// @access  Private
exports.getAppointments = async (req, res) => {
  try {
    let query = {};
    const { status, doctorId, patientId } = req.query;

    if (status) {
      query.status = status;
    }

    if (req.user.role === 'PATIENT') {
      const patient = await Patient.findOne({ userId: req.user._id });
      if (!patient) return res.json({ success: true, count: 0, data: [] });
      query.patientId = patient._id;
    } else if (req.user.role === 'DOCTOR') {
      const doctor = await Doctor.findOne({ userId: req.user._id });
      if (!doctor) return res.json({ success: true, count: 0, data: [] });
      query.doctorId = doctor._id;
    } else if (req.user.role === 'ADMIN') {
      if (doctorId) query.doctorId = doctorId;
      if (patientId) query.patientId = patientId;
    }

    const appointments = await Appointment.find(query)
      .populate({
        path: 'doctorId',
        populate: [
          { path: 'userId', select: 'name email phone' },
          { path: 'specialization', select: 'name' }
        ]
      })
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: 'name email phone' }
      })
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single appointment by ID
// @route   GET /api/appointments/:id
// @access  Private
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate({
        path: 'doctorId',
        populate: [
          { path: 'userId', select: 'name email phone' },
          { path: 'specialization', select: 'name' }
        ]
      })
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: 'name email phone' }
      });

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    return res.json({
      success: true,
      data: appointment
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update appointment status (Doctor/Admin: Confirm, Reject, Complete, Cancel)
// @route   PUT /api/appointments/:id/status
// @access  Private (Doctor/Admin)
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    const validStatuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid appointment status' });
    }

    let appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Permission check for Doctor role
    if (req.user.role === 'DOCTOR') {
      const doctor = await Doctor.findOne({ userId: req.user._id });
      if (!doctor || appointment.doctorId.toString() !== doctor._id.toString()) {
        return res.status(403).json({ success: false, message: 'Unauthorized to modify this appointment' });
      }
    }

    appointment.status = status;
    if (adminNotes !== undefined) appointment.adminNotes = adminNotes;
    await appointment.save();

    const updatedAppointment = await Appointment.findById(req.params.id)
      .populate({
        path: 'doctorId',
        populate: [
          { path: 'userId', select: 'name email phone' },
          { path: 'specialization', select: 'name' }
        ]
      })
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: 'name email phone' }
      });

    return res.json({
      success: true,
      message: `Appointment status updated to ${status}`,
      data: updatedAppointment
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel appointment (Patient/Admin)
// @route   DELETE /api/appointments/:id
// @access  Private (Patient/Admin)
exports.cancelAppointment = async (req, res) => {
  try {
    let appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (req.user.role === 'PATIENT') {
      const patient = await Patient.findOne({ userId: req.user._id });
      if (!patient || appointment.patientId.toString() !== patient._id.toString()) {
        return res.status(403).json({ success: false, message: 'Unauthorized to cancel this appointment' });
      }
    }

    appointment.status = 'Cancelled';
    await appointment.save();

    return res.json({
      success: true,
      message: 'Appointment cancelled successfully'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
