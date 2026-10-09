const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const generateToken = require('../utils/generateToken');

// @desc    Register a new patient
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, gender, dateOfBirth, address } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'PATIENT',
      phone
    });

    const patient = await Patient.create({
      userId: user._id,
      gender: gender || 'Unspecified',
      dateOfBirth: dateOfBirth || null,
      address: address || ''
    });

    const token = generateToken(user._id, user.role);

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        patientId: patient._id
      }
    });
  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    let roleDetails = {};
    if (user.role === 'PATIENT') {
      const patient = await Patient.findOne({ userId: user._id });
      if (patient) roleDetails.patientId = patient._id;
    } else if (user.role === 'DOCTOR') {
      const doctor = await Doctor.findOne({ userId: user._id }).populate('specialization');
      if (doctor) {
        roleDetails.doctorId = doctor._id;
        roleDetails.specialization = doctor.specialization;
      }
    }

    const token = generateToken(user._id, user.role);

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        ...roleDetails
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current logged in user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    let roleProfile = null;

    if (user.role === 'PATIENT') {
      roleProfile = await Patient.findOne({ userId: user._id });
    } else if (user.role === 'DOCTOR') {
      roleProfile = await Doctor.findOne({ userId: user._id }).populate('specialization');
    }

    return res.json({
      success: true,
      user,
      profile: roleProfile
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
