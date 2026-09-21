const express = require('express');
const router = express.Router();
const { createAppointment, getAppointments, updateAppointmentStatus } = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('host', 'admin'), createAppointment);
router.get('/', protect, getAppointments);
router.put('/:id', protect, authorize('admin', 'security', 'host'), updateAppointmentStatus);

module.exports = router;
