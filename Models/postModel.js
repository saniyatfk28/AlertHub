import mongoose from 'mongoose';
const { Schema } = mongoose;

const postSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  location: { 
    type: String, 
    required: true 
  },
  crimeType: { 
    type: String, 
    required: true 
  }
}, { timestamps: true });

export default mongoose.model('Post', postSchema);
