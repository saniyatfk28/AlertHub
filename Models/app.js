const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log('MongoDB connected'))
  .catch(console.error);

// Models

// User model (stores email and subscriptions)
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  subscriptions: [{
    location: { type: String, required: true },
    categories: [{ type: String, required: true }]
  }]
});
const User = mongoose.model('User', userSchema);

// Report model
const reportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  location: { type: String, required: true },
  category: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
const Report = mongoose.model('Report', reportSchema);

// Nodemailer transporter setup (Gmail SMTP)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // your gmail
    pass: process.env.EMAIL_PASS  // gmail app password
  }
});

// Route: Submit a new report
app.post('/api/reports', async (req, res) => {
  const { title, description, location, category } = req.body;
  if (!title || !location || !category) {
    return res.status(400).json({ error: 'Title, location, and category are required.' });
  }
  try {
    const newReport = new Report({ title, description, location, category });
    await newReport.save();

    // Notify subscribed users
    notifySubscribers(newReport);

    return res.status(201).json({ message: 'Report submitted successfully', report: newReport });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Route: Subscribe to location & categories
app.post('/api/subscribe', async (req, res) => {
  const { email, location, categories } = req.body;
  if (!email || !location || !Array.isArray(categories)) {
    return res.status(400).json({ error: 'Email, location and categories array are required.' });
  }
  try {
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email, subscriptions: [{ location, categories }] });
    } else {
      // Update or add subscription for location
      const index = user.subscriptions.findIndex(s => s.location === location);
      if (index >= 0) {
        user.subscriptions[index].categories = categories;
      } else {
        user.subscriptions.push({ location, categories });
      }
    }
    await user.save();
    return res.json({ message: `Subscribed ${email} for ${location} with categories ${categories.join(', ')}` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Route: Unsubscribe user (location optional)
app.post('/api/unsubscribe', async (req, res) => {
  const { email, location } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required.' });
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (location) {
      // Remove subscription for this location only
      user.subscriptions = user.subscriptions.filter(s => s.location !== location);
    } else {
      // Remove all subscriptions - unsubscribe user completely
      user.subscriptions = [];
    }
    await user.save();
    return res.json({ message: location ? `Unsubscribed ${email} from ${location}` : `Unsubscribed ${email} from all locations` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Route: Get reports with optional filters location/category
app.get('/api/reports', async (req, res) => {
  const { location, category } = req.query;
  const filter = {};
  if (location) filter.location = location;
  if (category) filter.category = category;
  try {
    const reports = await Report.find(filter).sort({ createdAt: -1 }).limit(50);
    res.json({ reports });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


// Notification logic: send email alerts
async function notifySubscribers(report) {
  try {
    const usersToNotify = await User.find({
      subscriptions: {
        $elemMatch: {
          location: report.location,
          categories: report.category
        }
      }
    });
    if (!usersToNotify.length) {
      console.log('No subscribers to notify for this report.');
      return;
    }
    usersToNotify.forEach(user => {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: `New Incident in ${report.location} - ${report.category}`,
        text: `Hello,

A new incident has been reported in ${report.location} under category "${report.category}".

Title: ${report.title}
Description: ${report.description || 'N/A'}

Stay safe,
SoS Alerts Team
`
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.error('Error sending email:', error);
        }
        console.log(`Alert sent to ${user.email}: ${info.response}`);
      });
    });
  } catch (error) {
    console.error('Notification error:', error);
  }
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

