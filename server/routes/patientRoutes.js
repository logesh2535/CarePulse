const express = require('express');
const router = express.Router();
const { getPatients, getPatientById, updatePatient } = require('../controllers/patientController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, authorize('ADMIN'), getPatients);
router.get('/:id', protect, getPatientById);
router.put('/:id', protect, authorize('PATIENT', 'ADMIN'), updatePatient);

module.exports = router;
