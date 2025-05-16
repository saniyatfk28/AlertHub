import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
   location : String
});

const Location = mongoose.model("locations", locationSchema);
export default Location;
