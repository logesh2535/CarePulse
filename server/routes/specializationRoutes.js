const express = require('express');
const router = express.Router();
const {
  getSpecializations,
  createSpecialization,
  updateSpecialization,
  deleteSpecialization
} = require('../controllers/specializationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getSpecializations);
router.post('/', protect, authorize('ADMIN'), createSpecialization);
router.put('/:id', protect, authorize('ADMIN'), updateSpecialization);
router.delete('/:id', protect, authorize('ADMIN'), deleteSpecialization);

module.exports = router;
