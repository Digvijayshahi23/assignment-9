const QRCode = require('qrcode');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

exports.generateQRCode = async (data) => {
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(data));
    return qrCodeDataUrl;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

exports.generatePDFBadge = (passData, visitor, fileName) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: [300, 450] }); // Badge size
    const filePath = path.join(__dirname, '..', 'uploads', fileName);
    
    // Ensure uploads directory exists
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadsDir)){
        fs.mkdirSync(uploadsDir);
    }

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Design the badge
    doc.rect(0, 0, 300, 50).fill('#007bff');
    doc.fillColor('white').fontSize(20).text('VISITOR PASS', 0, 15, { align: 'center' });
    
    doc.fillColor('black').fontSize(16).text(visitor.name, 0, 70, { align: 'center' });
    doc.fontSize(12).text(`Company: ${visitor.company || 'N/A'}`, 0, 95, { align: 'center' });
    doc.fontSize(10).text(`Valid Until: ${new Date(passData.validUntil).toLocaleDateString()}`, 0, 115, { align: 'center' });

    // Assuming we pass base64 image of QR code, we need to convert it to buffer to embed in pdfkit
    if (passData.qrCodeImageUrl) {
      const base64Data = passData.qrCodeImageUrl.replace(/^data:image\/png;base64,/, "");
      const imgBuffer = Buffer.from(base64Data, 'base64');
      doc.image(imgBuffer, 75, 150, { width: 150 });
    }

    doc.end();
    
    stream.on('finish', () => resolve(`/uploads/${fileName}`));
    stream.on('error', (err) => reject(err));
  });
};
