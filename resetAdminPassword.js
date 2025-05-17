import mongoose from "mongoose";
import bcrypt from "bcrypt";
import UserModel from "./Models/userModel.js";

const mongoURI = "mongodb+srv://alerthub:Fa7ZEFv9Aew2aX0K@user.levy9gz.mongodb.net/?retryWrites=true&w=majority&appName=user";

async function resetPassword(username, newPassword) {
  try {
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to MongoDB");

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(newPassword, salt);

    const result = await UserModel.findOneAndUpdate(
      { username: username },
      { password: hashedPass },
      { new: true }
    );

    if (result) {
      console.log(`Password updated successfully for user: ${username}`);
    } else {
      console.log(`User with username ${username} not found.`);
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error resetting password:", error);
  }
}

resetPassword("user0", "password0");
