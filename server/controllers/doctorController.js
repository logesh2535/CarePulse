const bcrypt = require('bcryptjs');
const Doctor = require('../models/Doctor');
const User = require('../models/User');

// @desc    Get all doctors with optional filters (search name, specialization)
// @route   GET /api/doctors
// @access  Public
exports.getDoctors = async (req, res) => {
  try {
    const { specialization, search } = req.query;
    let query = {};

    if (specialization) {
      query.specialization = specialization;
    }

    let doctors = await Doctor.find(query)
      .populate({
        path: 'userId',
        select: 'name email phone role'
      })
      .populate('specialization');

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      doctors = doctors.filter(doc => doc.userId && searchRegex.test(doc.userId.name));
    }

    return res.json({
      success: true,
      count: doctors.length,
      data: doctors
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single doctor by Doctor ID
// @route   GET /api/doctors/:id
// @access  Public
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('specialization');

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    return res.json({
      success: true,
      data: doctor
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new doctor account & profile (Admin only)
// @route   POST /api/doctors
// @access  Private/Admin
exports.createDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      specialization,
      qualification,
      experience,
      consultationFee,
      description,
      profileImage,
      availability
    } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password || 'doctor123', salt);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'DOCTOR',
      phone
    });

    const doctor = await Doctor.create({
      userId: user._id,
      specialization,
      qualification,
      experience,
      consultationFee,
      description: description || '',
      profileImage: profileImage || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80',
      availability: availability || []
    });

    const populatedDoctor = await Doctor.findById(doctor._id)
      .populate('userId', 'name email phone')
      .populate('specialization');

    return res.status(201).json({
      success: true,
      message: 'Doctor account created successfully',
      data: populatedDoctor
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update doctor profile details
// @route   PUT /api/doctors/:id
// @access  Private/Doctor or Admin
exports.updateDoctor = async (req, res) => {
  try {
    let doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    // Permission check: only admin or the doctor themselves can update
    if (req.user.role === 'DOCTOR' && doctor.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized to update this doctor profile' });
    }

    const {
      name,
      phone,
      specialization,
      qualification,
      experience,
      consultationFee,
      description,
      profileImage,
      availability
    } = req.body;

    if (name || phone) {
      await User.findByIdAndUpdate(doctor.userId, {
        ...(name && { name }),
        ...(phone && { phone })
      });
    }

    doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      {
        ...(specialization && { specialization }),
        ...(qualification && { qualification }),
        ...(experience !== undefined && { experience }),
        ...(consultationFee !== undefined && { consultationFee }),
        ...(description !== undefined && { description }),
        ...(profileImage && { profileImage }),
        ...(availability && { availability })
      },
      { new: true, runValidators: true }
    )
      .populate('userId', 'name email phone')
      .populate('specialization');

    return res.json({
      success: true,
      message: 'Doctor profile updated successfully',
      data: doctor
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete doctor profile (Admin only)
// @route   DELETE /api/doctors/:id
// @access  Private/Admin
exports.deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    await User.findByIdAndDelete(doctor.userId);
    await Doctor.findByIdAndDelete(req.params.id);

    return res.json({
      success: true,
      message: 'Doctor removed successfully'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
