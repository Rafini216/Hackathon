import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  day: String,
  start: String,
  end: String 
});

export default mongoose.model("Availability", availabilitySchema);
