import mongoose from "mongoose";

const draftSchema = new mongoose.Schema({
    title: String,
    description: String,
    location: String,
    category: String,
    image_filename: String,
    status: { type: Number, default: 0 } // 0 for draft, 1 for published
}, { timestamps: true });

const Draft = mongoose.model("Draft", draftSchema);
export default Draft;
