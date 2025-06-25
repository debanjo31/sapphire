import Instructor from "../models/Instructor.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { generateToken } from "../utils/token.js";
import {
  instructorValidationSchema,
  updateInstructorValidationSchema,
} from "../validation/InstructorValidation.js";

// Create a new instructor
export const createInstructor = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = instructorValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.details.map((detail) => detail.message),
      });
    }

    // Check if email already exists
    const existingInstructor = await Instructor.findOne({ email: value.email });
    if (existingInstructor) {
      return res.status(400).json({
        message: "An instructor with this email already exists",
      });
    }

    // Hash password
    const hashedPassword = hashPassword(value.password);

    // Create new instructor
    const instructor = new Instructor({
      ...value,
      password: hashedPassword,
    });

    // Save instructor
    await instructor.save();

    // Generate token for authentication
    const token = generateToken(instructor._id);

    // Remove password from response
    const instructorResponse = instructor.toObject();
    delete instructorResponse.password;

    res.status(201).json({
      message: "Instructor created successfully",
      instructor: instructorResponse,
      token,
    });
  } catch (error) {
    console.error("Create instructor error:", error);
    res.status(500).json({
      message: "Failed to create instructor",
      error: error.message,
    });
  }
};

// Get all instructors with optional filters
export const getAllInstructors = async (req, res) => {
  try {
    const { department, expertise, isActive } = req.query;

    // Build filter object based on query parameters
    const filter = {};
    if (department) filter.department = department;
    if (expertise) filter.expertise = { $in: [expertise] };
    if (isActive !== undefined) filter.isActive = isActive === "true";

    const instructors = await Instructor.find(filter)
      .select("-password") // Exclude password
      .populate("courses", "name description"); // Populate courses with selected fields

    res.status(200).json({
      message: "Instructors retrieved successfully",
      count: instructors.length,
      instructors,
    });
  } catch (error) {
    console.error("Get all instructors error:", error);
    res.status(500).json({
      message: "Failed to retrieve instructors",
      error: error.message,
    });
  }
};

// Get instructor by ID
export const getInstructorById = async (req, res) => {
  try {
    const instructor = await Instructor.findById(req.params.id)
      .select("-password")
      .populate("courses", "name description");

    if (!instructor) {
      return res.status(404).json({
        message: "Instructor not found",
      });
    }

    res.status(200).json({
      message: "Instructor retrieved successfully",
      instructor,
    });
  } catch (error) {
    console.error("Get instructor error:", error);
    res.status(500).json({
      message: "Failed to retrieve instructor",
      error: error.message,
    });
  }
};

// Update instructor
export const updateInstructor = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = updateInstructorValidationSchema.validate(
      req.body
    );
    if (error) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.details.map((detail) => detail.message),
      });
    }

    // If updating email, check if it already exists
    if (value.email) {
      const existingInstructor = await Instructor.findOne({
        email: value.email,
        _id: { $ne: req.params.id },
      });
      if (existingInstructor) {
        return res.status(400).json({
          message: "This email is already in use",
        });
      }
    }

    // If updating password, hash it
    if (value.password) {
      value.password = hashPassword(value.password);
    }

    // Update instructor
    const updatedInstructor = await Instructor.findByIdAndUpdate(
      req.params.id,
      { $set: value },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedInstructor) {
      return res.status(404).json({
        message: "Instructor not found",
      });
    }

    res.status(200).json({
      message: "Instructor updated successfully",
      instructor: updatedInstructor,
    });
  } catch (error) {
    console.error("Update instructor error:", error);
    res.status(500).json({
      message: "Failed to update instructor",
      error: error.message,
    });
  }
};

// Delete instructor
export const deleteInstructor = async (req, res) => {
  try {
    const instructor = await Instructor.findByIdAndDelete(req.params.id);

    if (!instructor) {
      return res.status(404).json({
        message: "Instructor not found",
      });
    }

    res.status(200).json({
      message: "Instructor deleted successfully",
    });
  } catch (error) {
    console.error("Delete instructor error:", error);
    res.status(500).json({
      message: "Failed to delete instructor",
      error: error.message,
    });
  }
};

// Instructor login
export const loginInstructor = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find instructor by email
    const instructor = await Instructor.findOne({ email });
    if (!instructor) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Verify password
    const isPasswordValid = comparePassword(password, instructor.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Generate token
    const token = generateToken(instructor._id);

    // Remove password from response
    const instructorResponse = instructor.toObject();
    delete instructorResponse.password;

    res.status(200).json({
      message: "Login successful",
      instructor: instructorResponse,
      token,
    });
  } catch (error) {
    console.error("Login instructor error:", error);
    res.status(500).json({
      message: "Failed to login",
      error: error.message,
    });
  }
};

// Add course to instructor
export const addCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const instructorId = req.params.id;

    const instructor = await Instructor.findById(instructorId);
    if (!instructor) {
      return res.status(404).json({
        message: "Instructor not found",
      });
    }

    // Check if course is already assigned
    if (instructor.courses.includes(courseId)) {
      return res.status(400).json({
        message: "Course is already assigned to this instructor",
      });
    }

    // Add course to instructor's courses
    instructor.courses.push(courseId);
    await instructor.save();

    res.status(200).json({
      message: "Course added successfully",
      instructor,
    });
  } catch (error) {
    console.error("Add course error:", error);
    res.status(500).json({
      message: "Failed to add course",
      error: error.message,
    });
  }
};

// Remove course from instructor
export const removeCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const instructorId = req.params.id;

    const instructor = await Instructor.findById(instructorId);
    if (!instructor) {
      return res.status(404).json({
        message: "Instructor not found",
      });
    }

    // Remove course from instructor's courses
    instructor.courses = instructor.courses.filter(
      (course) => course.toString() !== courseId
    );
    await instructor.save();

    res.status(200).json({
      message: "Course removed successfully",
      instructor,
    });
  } catch (error) {
    console.error("Remove course error:", error);
    res.status(500).json({
      message: "Failed to remove course",
      error: error.message,
    });
  }
};
