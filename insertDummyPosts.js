import mongoose from "mongoose";
import dotenv from "dotenv";
import PostModel from "./Models/postModel.js";

dotenv.config();

const posts = [
  {
    userId: "Tawsif Mahbub",
    content: "All eyes on chintaikari.",
    crimeType: "Robbery",
    location: "Mohammadpur",
    likes: [],
    createdAt: new Date(),
  },
  {
    userId: "Moshiur Rahman Shams",
    content: "Guys I repeat. All eyes on KUET!We have no army and police and our students are getting attacked by chatradal. Need help. Students are getting injured like flies here.",
    crimeType: "Mugging",
    location: "KUET, Khulna",
    likes: [],
    createdAt: new Date(),
  },
  {
    userId: "Shoukot Ullah",
    content: "Fire incident happened again at Camp-11 in the world largest refugee camp of BD. May Allah protect us from the massive fire incident. Aameen",
    crimeType: "Fire",
    location: "Camp-11, Ukhiya, Coxs's Bazar",
    likes: [],
    createdAt: new Date(),
  },
];

const insertDummyPosts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await PostModel.insertMany(posts);
    console.log("Dummy posts inserted successfully.");
    await mongoose.disconnect();
  } catch (error) {
    console.error("Error inserting dummy posts:", error);
  }
};

insertDummyPosts();
