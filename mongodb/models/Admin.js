import mongoose, { Schema } from "mongoose";

const adminSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
