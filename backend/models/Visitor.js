const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  company: { type: String },
  photoUrl: { type: String }, // Path to uploaded photo
  address: { type: String },
  idProofUrl: { type: String }, // Optional, path to ID proof
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Visitor', visitorSchema);
