import mongoose, { Schema } from "mongoose";

const courseSchema = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  weeks: { type: Number, required: true, min: 1 }, // Duration in hours
  level: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    required: true,
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Instructor",
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
});

const Course = mongoose.model("Course", courseSchema);
export default Course;
