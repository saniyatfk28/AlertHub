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

    // Delete existing users and posts
    // await UserModel.deleteMany({});
    // await PostModel.deleteMany({});
    console.log('Deleted existing users and posts');

    // Create dummy User data
    const users = [];
    for (let i = 0; i < 10; i++) {
      const email = `user${i}@example.com`;
      // Check if user with this email already exists
      const existingUser = await UserModel.findOne({ email: email });
      if (!existingUser) {
        const newUser = new UserModel({
          username: `user${i}`,
          password: `password${i}`,
          firstname: `First${i}`,
          lastname: `Last${i}`,
          isAdmin: i % 2 === 0,
          email: email,
          address: `123 Main St, City${i}`
        });
        await newUser.save();
        users.push(newUser);
        console.log(`Created user: ${newUser.username}`);
      } else {
        users.push(existingUser);
        console.log(`User ${email} already exists`);
      }
    }

    // Create dummy Post data
    const posts = [];
    const locations = ['Mohammadpur', 'notun bazar', 'malibagh', 'shantinagar'];
    const crimeTypes = ['theft', 'robbery', 'kidnapping', 'murder'];

    const currentYear = new Date().getFullYear();

    for (let month = 0; month < 12; month++) {
      for (let i = 0; i < 5; i++) {
        let location = locations[i % locations.length];
        let crimeType = crimeTypes[i % crimeTypes.length];
        let userId = users[Math.floor(Math.random() * users.length)]._id;

        // Get the first day of the month
        const startOfMonth = new Date(currentYear, month, 1);

        // Get the last day of the month
        const endOfMonth = new Date(currentYear, month + 1, 0);

        // Generate a random date between the first and last day of the month
        const randomDate = new Date(startOfMonth.getTime() + Math.random() * (endOfMonth.getTime() - startOfMonth.getTime()));

        const newPost = new PostModel({
          location: location,
          crimeType: crimeType,
          createdAt: randomDate,
          userId: userId
        });
        await newPost.save();
        posts.push(newPost);
        console.log(`Created post: ${newPost.location} - ${newPost.crimeType} - ${randomDate}`);
      }
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
