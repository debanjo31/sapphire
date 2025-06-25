import express from "express";
import {
  createInstructor,
  getAllInstructors,
  getInstructorById,
  updateInstructor,
  deleteInstructor,
  loginInstructor,
  addCourse,
  removeCourse,
} from "../controller/Instructor.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/login", loginInstructor);
router.get("/", getAllInstructors);
router.get("/:id", getInstructorById);

// Protected routes
router.post("/", authenticateToken, createInstructor);
router.put("/:id", authenticateToken, updateInstructor);
router.delete("/:id", authenticateToken, deleteInstructor);
router.post("/:id/courses", authenticateToken, addCourse);
router.delete("/:id/courses", authenticateToken, removeCourse);

export default router;
