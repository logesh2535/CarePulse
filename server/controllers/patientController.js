const Patient = require('../models/Patient');
const User = require('../models/User');

// @desc    Get all patients (Admin only)
// @route   GET /api/patients
// @access  Private/Admin
exports.getPatients = async (req, res) => {
  try {
    const patients = await Patient.find().populate('userId', 'name email phone role createdAt');
    return res.json({
      success: true,
      count: patients.length,
      data: patients
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single patient by Patient ID
// @route   GET /api/patients/:id
// @access  Private
exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).populate('userId', 'name email phone role');
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    return res.json({
      success: true,
      data: patient
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update patient profile
// @route   PUT /api/patients/:id
// @access  Private (Patient/Admin)
exports.updatePatient = async (req, res) => {
  try {
    let patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    if (req.user.role === 'PATIENT' && patient.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized to update this profile' });
    }

    const { name, phone, dateOfBirth, gender, address, bloodGroup, medicalInformation } = req.body;

    if (name || phone) {
      await User.findByIdAndUpdate(patient.userId, {
        ...(name && { name }),
        ...(phone && { phone })
      });
    }

    patient = await Patient.findByIdAndUpdate(
      req.params.id,
      {
        ...(dateOfBirth && { dateOfBirth }),
        ...(gender && { gender }),
        ...(address !== undefined && { address }),
        ...(bloodGroup && { bloodGroup }),
        ...(medicalInformation !== undefined && { medicalInformation })
      },
      { new: true, runValidators: true }
    ).populate('userId', 'name email phone');

    return res.json({
      success: true,
      message: 'Patient profile updated successfully',
      data: patient
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
