import Course from "../models/Course.js";
import {
  courseValidationSchema,
  updateCourseValidationSchema,
} from "../validation/CourseValidation.js";

// Create a new course
export const createCourse = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = courseValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.details.map((detail) => detail.message),
      });
    }

    const { title, description, level } = value;

    // Check if course with the same title already exists
    const existingCourse = await Course.findOne({
      title: title.trim(),
    });

    if (existingCourse) {
      return res.status(400).json({
        message: "A course with this title already exists",
      });
    }

    // Create new course
    const course = new Course({
      title,
      description,
      level,
      weeks: value.weeks || 1, // Default to 1 week if not provided
      admin: req.userId, // Assuming req.admin is set by middleware
    });
    await course.save();
    res.status(201).json({
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.error("Create course error:", error);
    res.status(500).json({
      message: "Failed to create course",
      error: error.message,
    });
  }
};

// Get all courses with optional filters
export const getAllCourses = async (req, res) => {
  try {
    const { level, instructor, search } = req.query;

    // Build filter object based on query parameters
    const filter = {};
    if (level) filter.level = level;
    if (instructor) filter.instructor = instructor;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const courses = await Course.find(filter).populate(
      "admin",
      "firstName lastName"
    );

    res.status(200).json({
      message: "Courses retrieved successfully",
      count: courses.length,
      courses,
    });
  } catch (error) {
    console.error("Get all courses error:", error);
    res.status(500).json({
      message: "Failed to retrieve courses",
      error: error.message,
    });
  }
};

// Get course by ID
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("instructor", "firstName lastName email")
      .populate("admin", "name email");

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    res.status(200).json({
      message: "Course retrieved successfully",
      course,
    });
  } catch (error) {
    console.error("Get course error:", error);
    res.status(500).json({
      message: "Failed to retrieve course",
      error: error.message,
    });
  }
};

// Update course
export const updateCourse = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = updateCourseValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.details.map((detail) => detail.message),
      });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { $set: value },
      { new: true, runValidators: true }
    )
      .populate("instructor", "firstName lastName email")
      .populate("admin", "name email");

    if (!updatedCourse) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    res.status(200).json({
      message: "Course updated successfully",
      course: updatedCourse,
    });
  } catch (error) {
    console.error("Update course error:", error);
    res.status(500).json({
      message: "Failed to update course",
      error: error.message,
    });
  }
};

// Delete course
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    res.status(200).json({
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Delete course error:", error);
    res.status(500).json({
      message: "Failed to delete course",
      error: error.message,
    });
  }
};

// Get courses by instructor
export const getCoursesByInstructor = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.params.instructorId })
      .populate("instructor", "firstName lastName email")
      .populate("admin", "name email");

    res.status(200).json({
      message: "Courses retrieved successfully",
      count: courses.length,
      courses,
    });
  } catch (error) {
    console.error("Get courses by instructor error:", error);
    res.status(500).json({
      message: "Failed to retrieve courses",
      error: error.message,
    });
  }
};

// Get courses by level
export const getCoursesByLevel = async (req, res) => {
  try {
    const courses = await Course.find({ level: req.params.level })
      .populate("instructor", "firstName lastName email")
      .populate("admin", "name email");

    res.status(200).json({
      message: "Courses retrieved successfully",
      count: courses.length,
      courses,
    });
  } catch (error) {
    console.error("Get courses by level error:", error);
    res.status(500).json({
      message: "Failed to retrieve courses",
      error: error.message,
    });
  }
};
