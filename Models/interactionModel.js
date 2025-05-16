import mongoose from "mongoose";

const interactionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    title: {
      type: String,
    },
    details: {
      type: String,
    },
    category: {
      type: String,
    },
    location: {
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

const InteractionModel = mongoose.model("interactions", interactionSchema);
export default InteractionModel;
