const Appointment = require('../models/Appointment');
const Visitor = require('../models/Visitor');
const { sendEmail } = require('../utils/email');

exports.createAppointment = async (req, res) => {
  try {
    const { visitorId, purpose, scheduledDate, scheduledTime } = req.body;
    
    const appointment = new Appointment({
      host: req.user.id,
      visitor: visitorId,
      purpose,
      scheduledDate,
      scheduledTime
    });

    await appointment.save();

    const visitor = await Visitor.findById(visitorId);
    if (visitor) {
      // Send invite email
      await sendEmail(
        visitor.email, 
        'Meeting Invitation', 
        `<p>You have been invited for a meeting on ${new Date(scheduledDate).toDateString()} at ${scheduledTime}.</p><p>Purpose: ${purpose}</p>`
      );
    }

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAppointments = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'host') {
      query.host = req.user.id;
    }
    const appointments = await Appointment.find(query).populate('visitor').populate('host', 'name email');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
