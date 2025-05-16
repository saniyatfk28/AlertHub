import PostModel from "../Models/postModel.js";
import TagModel from "../Models/tagModel.js";
import LocationModel from "../Models/locationModel.js";
import DraftModel from "../Models/draftModel.js";
import UserModel from "../Models/userModel.js";
import mongoose from "mongoose";

// -------------------- POST MANAGEMENT --------------------

export const createPost = async (req, res) => {
  const newPost = new PostModel(req.body);
  try {
    await newPost.save();
    res.status(200).json("Post created!");
  } catch (error) {
    res.status(500).json(error);
  }
};

// Admin-style post reporting (alternative post creator)
export const postReporting = async (req, res) => {
  const { data } = req.body;
  try {
    await PostModel.create({
      title: data.title,
      details: data.details,
      category: data.category,
      location: data.location,
      address: data.address,
      status: data.status,
      image: data.image,
    });
    res.status(200).json("Success");
  } catch (err) {
    res.status(500).json("Failed");
  }
};

export const getPost = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await InteractionModel.findById(id);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const updatePost = async (req, res) => {
  const postId = req.params.id;
  const { userId } = req.body;
  try {
    const post = await InteractionModel.findById(postId);
    if (post.userId === userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("Post Updated");
    } else {
      res.status(403).json("Action forbidden");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export const deletePost = async (req, res) => {
  const id = req.params.id;
  const { userId } = req.body;
  try {
    const post = await InteractionModel.findById(id);
    if (post.userId === userId) {
      await post.deleteOne();
      res.status(200).json("Post deleted successfully");
    } else {
      res.status(403).json("Action forbidden");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export const likePost = async (req, res) => {
  const id = req.params.id;
  const { userId } = req.body;
  try {
    const post = await InteractionModel.findById(id);
    if (!post.likes.includes(userId)) {
      await post.updateOne({ $push: { likes: userId } });
      res.status(200).json("Post liked");
    } else {
      await post.updateOne({ $pull: { likes: userId } });
      res.status(200).json("Post unliked");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getTimelinePosts = async (req, res) => {
  const userId = req.params.id;
  try {
    const currentUserPosts = await InteractionModel.find({ userId: userId });
    const followingPosts = await UserModel.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(userId) },
      },
      {
        $lookup: {
          from: "interactions",
          localField: "following",
          foreignField: "userId",
          as: "followingPosts",
        },
      },
      {
        $project: { followingPosts: 1, _id: 0 },
      },
    ]);
    res
      .status(200)
      .json(
        currentUserPosts
          .concat(...followingPosts[0].followingPosts)
          .sort((a, b) => b.createdAt - a.createdAt)
      );
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await InteractionModel.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json(error);
  }
};

// -------------------- TAG MANAGEMENT --------------------

export const postTag = async (req, res) => {
  const { tag } = req.body;
  try {
    await TagModel.create({ tag });
    res.status(200).json("Success");
  } catch (err) {
    res.status(500).json("Failed");
  }
};

export const getTag = async (req, res) => {
  try {
    const response = await TagModel.find();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json("Failed");
  }
};

// -------------------- LOCATION MANAGEMENT --------------------

export const postLocation = async (req, res) => {
  const { location } = req.body;
  try {
    await LocationModel.create({ location });
    res.status(200).json("Success");
  } catch (error) {
    res.status(500).json("Failed");
  }
};

export const getLocation = async (req, res) => {
  try {
    const response = await LocationModel.find();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json("Failed");
  }
};

// -------------------- DRAFT MANAGEMENT --------------------

export const saveDraft = async (req, res) => {
  const { data } = req.body;
  try {
    await DraftModel.create({
      title: data.title,
      details: data.details,
      category: data.category,
      address: data.address,
      image: data.image,
      status: 0,
    });
    res.status(200).json("Draft saved successfully");
  } catch (err) {
    res.status(500).json("Failed to save draft");
  }
};

export const getDrafts = async (req, res) => {
  try {
    const response = await DraftModel.find({ status: 0 }).sort({ createdAt: -1 });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json("Failed to fetch drafts");
  }
};

export const getDraftById = async (req, res) => {
  try {
    const draft = await DraftModel.findById(req.params.id);
    if (!draft) {
      return res.status(404).json("Draft not found");
    }
    res.status(200).json(draft);
  } catch (error) {
    res.status(500).json("Failed to fetch draft");
  }
};

export const deleteDraft = async (req, res) => {
  try {
    await DraftModel.findByIdAndDelete(req.params.id);
    res.status(200).json("Draft deleted successfully");
  } catch (error) {
    res.status(500).json("Failed to delete draft");
  }
};
