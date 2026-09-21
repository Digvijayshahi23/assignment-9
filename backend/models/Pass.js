const mongoose = require('mongoose');

const passSchema = new mongoose.Schema({
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
  visitor: { type: mongoose.Schema.Types.ObjectId, ref: 'Visitor', required: true },
  qrCodeData: { type: String }, // The data encoded in the QR
  qrCodeImageUrl: { type: String }, // Path or base64 of QR code image
  pdfUrl: { type: String }, // Path to generated PDF badge
  validFrom: { type: Date, required: true },
  validUntil: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['active', 'expired', 'revoked'], 
    default: 'active' 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Pass', passSchema);
