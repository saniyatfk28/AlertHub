const mongoose = require('mongoose');

const sosCallSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: String,
  message: String,
  location: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SosCall', sosCallSchema);
