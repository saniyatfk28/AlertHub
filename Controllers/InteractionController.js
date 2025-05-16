import InteractionModel from "../Models/interactionModel.js";
import UserModel from "../Models/userModel.js";
import mongoose from "mongoose";

// -------------------- INTERACTION MANAGEMENT --------------------

export const createInteraction = async (req, res) => {
  const newInteraction = new InteractionModel(req.body);
  try {
    await newInteraction.save();
    res.status(200).json("Interaction created!");
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getInteraction = async (req, res) => {
  const id = req.params.id;
  try {
    const interaction = await InteractionModel.findById(id);
    res.status(200).json(interaction);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const updateInteraction = async (req, res) => {
  const interactionId = req.params.id;
  const { userId } = req.body;
  try {
    const interaction = await InteractionModel.findById(interactionId);
    if (interaction.userId === userId) {
      await interaction.updateOne({ $set: req.body });
      res.status(200).json("Interaction Updated");
    } else {
      res.status(403).json("Action forbidden");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export const deleteInteraction = async (req, res) => {
  const id = req.params.id;
  const { userId } = req.body;
  try {
    const interaction = await InteractionModel.findById(id);
    if (interaction.userId === userId) {
      await interaction.deleteOne();
      res.status(200).json("Interaction deleted successfully");
    } else {
      res.status(403).json("Action forbidden");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export const likeInteraction = async (req, res) => {
  const id = req.params.id;
  const { userId } = req.body;
  try {
    const interaction = await InteractionModel.findById(id);
    if (!interaction.likes.includes(userId)) {
      await interaction.updateOne({ $push: { likes: userId } });
      res.status(200).json("Interaction liked");
    } else {
      await interaction.updateOne({ $pull: { likes: userId } });
      res.status(200).json("Interaction unliked");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getTimelineInteractions = async (req, res) => {
  const userId = req.params.id;
  try {
    const currentUserInteractions = await InteractionModel.find({ userId: userId });
    const followingInteractions = await UserModel.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(userId) },
      },
      {
        $lookup: {
          from: "interactions",
          localField: "following",
          foreignField: "userId",
          as: "followingInteractions",
        },
      },
      {
        $project: { followingInteractions: 1, _id: 0 },
      },
    ]);
    res
      .status(200)
      .json(
        currentUserInteractions
          .concat(...followingInteractions[0].followingInteractions)
          .sort((a, b) => b.createdAt - a.createdAt)
      );
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getAllInteractions = async (req, res) => {
  try {
    const interactions = await InteractionModel.find().sort({ createdAt: -1 });
    console.log("Sending interactions data:", interactions);
    res.status(200).json(interactions);
  } catch (error) {
    res.status(500).json(error);
  }
};
