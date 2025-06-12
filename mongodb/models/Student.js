import mongoose, { Schema } from "mongoose";

const studentSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: {
    type: Number,
    min: [16, "You are too young"],
    max: [70, "You are too old"],
  },
  gender: {
    type: String,
    enum: ["male", "female"],
  },
  virtual: { type: Boolean, default: false },
  bestFood: [String],
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

const Student = mongoose.model("Student", studentSchema);
export default Student;
