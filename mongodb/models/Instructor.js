import mongoose from "mongoose";

const instructorSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    expertise: [
      {
        type: String,
        trim: true,
      },
    ],
    qualification: {
      type: String,
      required: true,
      trim: true,
    },
    yearsOfExperience: {
      type: Number,
      required: true,
      min: 0,
    },
    contactNumber: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    profileImage: {
      type: String,
      default: null,
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    officeHours: [
      {
        day: {
          type: String,
          enum: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
        },
        startTime: String,
        endTime: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Instructor", instructorSchema);
