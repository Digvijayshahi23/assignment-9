const mongoose = require('mongoose');

const checkLogSchema = new mongoose.Schema({
  pass: { type: mongoose.Schema.Types.ObjectId, ref: 'Pass', required: true },
  visitor: { type: mongoose.Schema.Types.ObjectId, ref: 'Visitor', required: true },
  scannedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Security personnel
  checkInTime: { type: Date, required: true },
  checkOutTime: { type: Date },
  status: {
    type: String,
    enum: ['checked_in', 'checked_out'],
    default: 'checked_in'
  }
});

module.exports = mongoose.model('CheckLog', checkLogSchema);
