const Pass = require('../models/Pass');
const Appointment = require('../models/Appointment');
const CheckLog = require('../models/CheckLog');
const { generateQRCode, generatePDFBadge } = require('../utils/generator');

exports.issuePass = async (req, res) => {
  try {
    const { appointmentId, validFrom, validUntil } = req.body;
    const appointment = await Appointment.findById(appointmentId).populate('visitor');
    
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    
    // Create pass record
    let pass = new Pass({
      appointment: appointmentId,
      visitor: appointment.visitor._id,
      validFrom,
      validUntil
    });
    
    // Generate QR
    const qrData = { passId: pass._id, visitorId: appointment.visitor._id };
    const qrCodeImageUrl = await generateQRCode(qrData);
    pass.qrCodeData = JSON.stringify(qrData);
    pass.qrCodeImageUrl = qrCodeImageUrl;
    
    // Generate PDF Badge
    const pdfFileName = `badge_${pass._id}.pdf`;
    const pdfUrl = await generatePDFBadge(pass, appointment.visitor, pdfFileName);
    pass.pdfUrl = pdfUrl;
    
    await pass.save();
    
    // Update appointment status to approved
    appointment.status = 'approved';
    await appointment.save();
    
    res.status(201).json(pass);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getPasses = async (req, res) => {
  try {
    const passes = await Pass.find().populate('visitor').populate('appointment');
    res.json(passes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.scanPass = async (req, res) => {
  try {
    const { passId } = req.body;
    const pass = await Pass.findById(passId);
    
    if (!pass) return res.status(404).json({ message: 'Pass not found' });
    if (pass.status !== 'active') return res.status(400).json({ message: `Pass is ${pass.status}` });
    
    const now = new Date();
    if (now < pass.validFrom || now > pass.validUntil) {
       pass.status = 'expired';
       await pass.save();
       return res.status(400).json({ message: 'Pass is expired or not yet valid' });
    }

    // Check if there is an active check-in
    let checkLog = await CheckLog.findOne({ pass: passId, status: 'checked_in' });
    
    if (checkLog) {
      // Check out
      checkLog.checkOutTime = now;
      checkLog.status = 'checked_out';
      await checkLog.save();
      res.json({ message: 'Checked out successfully', log: checkLog });
    } else {
      // Check in
      checkLog = new CheckLog({
        pass: passId,
        visitor: pass.visitor,
        scannedBy: req.user.id,
        checkInTime: now,
        status: 'checked_in'
      });
      await checkLog.save();
      res.json({ message: 'Checked in successfully', log: checkLog });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getCheckLogs = async (req, res) => {
  try {
    const logs = await CheckLog.find().populate('visitor').populate('scannedBy', 'name');
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
