const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  visitor: { type: mongoose.Schema.Types.ObjectId, ref: 'Visitor', required: true },
  purpose: { type: String, required: true },
  scheduledDate: { type: Date, required: true },
  scheduledTime: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'completed'], 
    default: 'pending' 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
