import express from "express";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getCoursesByInstructor,
  getCoursesByLevel,
} from "../controller/Course.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const router = express.Router();

// Public routes
router.get("/api/course/", getAllCourses);
router.get("/api/course/:id", getCourseById);
router.get("/api/course/level/:level", getCoursesByLevel);
router.get("/api/course/instructor/:instructorId", getCoursesByInstructor);

// Protected routes (require authentication)
router.post("/api/course", verifyAdmin, createCourse);
router.put("/api/course/:id", verifyAdmin, updateCourse);
router.delete("/api/course/:id", verifyAdmin, deleteCourse);

export default router;
