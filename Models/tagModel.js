import mongoose from "mongoose";

const tagSchema = new mongoose.Schema({
   tag : String
});

const Tag = mongoose.model("tags", tagSchema);
export default Tag;
