const Specialization = require('../models/Specialization');

// @desc    Get all specializations
// @route   GET /api/specializations
// @access  Public
exports.getSpecializations = async (req, res) => {
  try {
    const specializations = await Specialization.find({ isActive: true }).sort({ name: 1 });
    return res.json({
      success: true,
      count: specializations.length,
      data: specializations
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new specialization (Admin only)
// @route   POST /api/specializations
// @access  Private/Admin
exports.createSpecialization = async (req, res) => {
  try {
    const { name, description, icon } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Specialization name is required' });
    }

    const existing = await Specialization.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Specialization already exists' });
    }

    const specialization = await Specialization.create({
      name,
      description: description || '',
      icon: icon || 'stethoscope'
    });

    return res.status(201).json({
      success: true,
      message: 'Specialization added successfully',
      data: specialization
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update specialization (Admin only)
// @route   PUT /api/specializations/:id
// @access  Private/Admin
exports.updateSpecialization = async (req, res) => {
  try {
    const { name, description, icon, isActive } = req.body;

    let specialization = await Specialization.findById(req.params.id);
    if (!specialization) {
      return res.status(404).json({ success: false, message: 'Specialization not found' });
    }

    specialization = await Specialization.findByIdAndUpdate(
      req.params.id,
      {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(icon && { icon }),
        ...(isActive !== undefined && { isActive })
      },
      { new: true, runValidators: true }
    );

    return res.json({
      success: true,
      message: 'Specialization updated successfully',
      data: specialization
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete specialization (Admin only)
// @route   DELETE /api/specializations/:id
// @access  Private/Admin
exports.deleteSpecialization = async (req, res) => {
  try {
    const specialization = await Specialization.findById(req.params.id);
    if (!specialization) {
      return res.status(404).json({ success: false, message: 'Specialization not found' });
    }

    await Specialization.findByIdAndDelete(req.params.id);

    return res.json({
      success: true,
      message: 'Specialization deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
