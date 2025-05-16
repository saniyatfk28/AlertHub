import mongoose from "mongoose";
import dotenv from "dotenv";
import InteractionModel from "./Models/interactionModel.js";

dotenv.config();

const interactions = [
  {
    userId: "Farzana Haque",
    title: "Flood at Sunamganj Stay Strong, Stay United",
    details: "Heavy floods have hit Sunamganj again. Homes are underwater, but hope still floats. Volunteers and youth groups are stepping in. Let’s keep helping, keep praying, and keep believing",
    category: "Floor",
    location: "Sylhet",
    status: 1,
    image: "",
    createdAt: new Date(),
  },
  {
    userId: "Rafiul Hasan",
    title: "From Darkness to Light",
    details: "Electricity may be gone, but the light inside us isnt. Power outages cant dim the dreams of Rangpurs students, who are studying by candlelight, helping each other prepare for exams. Keep going, warriors. Your grit is your power.",
    category: "Load shedding",
    location: "Rangpur",
    status: 1,
    image: "",
    createdAt: new Date(),
  },
  {
    userId: "Zubair Hossain",
    title: "From Ashes We Rise Coxs Bazar Kids Back to School",
    details: "After the fire in Camp-12, many thought it was the end. But today, children walked back to class, holding hands, carrying borrowed books, and wearing unbreakable smiles. Hope is stronger than fire. Coxs Bazar Refugee Camp",
    category: "Fire",
    location: "Coxs's Bazar",
    status: 1,
    image: "",
    createdAt: new Date(),
  },
];

const insertDummyInteractions = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await InteractionModel.insertMany(interactions);
    console.log("Dummy interactions inserted successfully.");
    await mongoose.disconnect();
  } catch (error) {
    console.error("Error inserting dummy interactions:", error);
  }
};

insertDummyInteractions();
