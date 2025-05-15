const SosCall = require('../models/SosCall');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.createSos = async (req, res) => {
  try {
    const { name, phone, message, location } = req.body;

    if (!name || !location) {
      return res.status(400).json({ error: 'Name and location are required' });
    }

    const sosCall = new SosCall({ name, phone, message, location });
    await sosCall.save();

    const mailOptions = {
      from: `SOS Alert <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `[SOS ALERT] ${name} triggered an SOS from ${location}`,
      text: `SOS Triggered by: ${name}\nPhone: ${phone || 'N/A'}\nLocation: ${location}\nMessage: ${message || 'None'}\n\nPlease respond immediately!`
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      success: true,
      message: 'SOS call sent and saved',
      sosCall
    });
  } catch (err) {
    console.error('SOS Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
