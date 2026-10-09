const express = require('express');
const router = express.Router();
const {
  bookAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  cancelAppointment
} = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('PATIENT'), bookAppointment);
router.get('/', protect, getAppointments);
router.get('/:id', protect, getAppointmentById);
router.put('/:id/status', protect, authorize('DOCTOR', 'ADMIN'), updateAppointmentStatus);
router.delete('/:id', protect, authorize('PATIENT', 'ADMIN'), cancelAppointment);

module.exports = router;
