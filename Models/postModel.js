// Models/postModel.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const postSchema = new Schema({
  /* existing fields… */
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
