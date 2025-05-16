import mongoose from "mongoose";

const sosCallSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: String,
  message: String,
  location: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const SosCall = mongoose.model("SosCall", sosCallSchema);
export default SosCall;
