import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    details: {
      type: String,
    },
    category: {
      type: String,
    },
    address: {
      type: String,
    },
    status: {
      type: Number, // e.g., 0 = draft, 1 = submitted
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

const ReportPostModel = mongoose.model("posts", postSchema);
export default ReportPostModel;
