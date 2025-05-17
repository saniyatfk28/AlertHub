import SosCall from "../Models/SosCall.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const createSos = async (req, res) => {
  try {
    const { callerName, phone, message, location } = req.body;

    if (!callerName || !location) {
      return res.status(400).json({ error: "Name and location are required" });
    }

    const sosCall = new SosCall({ name: callerName, phone, message, location });
    await sosCall.save();

    const mailOptions = {
      from: `SOS Alert <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `[SOS ALERT] ${callerName} triggered an SOS from ${location}`,
      text: `SOS Triggered by: ${callerName}\nPhone: ${phone || "N/A"}\nLocation: ${location}\nMessage: ${message || "None"}\n\nPlease respond immediately!`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      success: true,
      message: "SOS call sent and saved",
      sosCall,
    });
  } catch (err) {
    console.error("SOS Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllSosCalls = async (req, res) => {
  try {
    const sosCalls = await SosCall.find().sort({ createdAt: -1 });
    res.status(200).json(sosCalls);
  } catch (err) {
    console.error("Get All SOS Calls Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateSosCallStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'resolved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const sosCall = await SosCall.findByIdAndUpdate(id, { status }, { new: true });

    if (!sosCall) {
      return res.status(404).json({ error: "SOS call not found" });
    }

    res.status(200).json({ message: "Status updated", sosCall });
  } catch (err) {
    console.error("Update SOS Call Status Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
