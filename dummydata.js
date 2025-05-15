import mongoose from 'mongoose';
import UserModel from './Models/userModel.js';
import PostModel from './Models/postModel.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_DB = process.env.MONGO_DB;

async function createDummyData() {
  try {
    await mongoose.connect(MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Create dummy User data
    const users = [];
    for (let i = 0; i < 10; i++) {
      const newUser = new UserModel({
        username: `user${i}`,
        password: `password${i}`,
        firstname: `First${i}`,
        lastname: `Last${i}`,
        isAdmin: i % 2 === 0,
      });
      await newUser.save();
      users.push(newUser);
      console.log(`Created user: ${newUser.username}`);
    }

    // Create dummy Post data
    const posts = [];
    const locations = ['Downtown', 'Uptown', 'Midtown', 'Suburbs', 'Industrial', 'Harbor'];
    const crimeTypes = ['Theft', 'Assault', 'Vandalism', 'Burglary', 'Arson'];

    for (let i = 0; i < 10; i++) {
      let createdAt = new Date(new Date().setDate(new Date().getDate() - Math.random() * 365));
      let location = locations[i % locations.length];
      let crimeType = crimeTypes[i % crimeTypes.length];

      // Allow same dates for Downtown - Theft
      if (location === 'Downtown' && crimeType === 'Theft' && i > 0 && Math.random() < 0.3) {
        createdAt = posts[i - 1].createdAt;
      }

      const newPost = new PostModel({
        location: location,
        crimeType: crimeType,
        createdAt: createdAt
      });
      await newPost.save();
      posts.push(newPost);
      console.log(`Created post: ${newPost.location} - ${newPost.crimeType} - ${createdAt}`);
    }

    console.log('Dummy data created successfully');
  } catch (error) {
    console.error('Error creating dummy data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

createDummyData();
