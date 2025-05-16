const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  subscriptions: [{
    location: { type: String, required: true },
    categories: [{ type: String, required: true }]
  }]
});
const User = mongoose.model('User', userSchema);

const reportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  location: { type: String, required: true },
  category: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
const Report = mongoose.model('Report', reportSchema);
