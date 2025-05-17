import mongoose from "mongoose";

const sosCallSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: String,
  message: String,
  location: { type: String, required: true },
  status: { type: String, enum: ['pending', 'resolved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

const SosCall = mongoose.model("SosCall", sosCallSchema);
export default SosCall;
