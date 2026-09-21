const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'tre.littel35@ethereal.email',
      pass: '36P3Gz16D4BqS29zSb'
  }
});

exports.sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: '"Visitor Pass System" <noreply@visitorpass.com>',
      to,
      subject,
      html
    });
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email', error);
  }
};
