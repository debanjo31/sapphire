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
import { verifyInstructor } from "../middleware/verifyInstructor.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const router = express.Router();

// Public routes
router.post("/api/instructor/login", loginInstructor);
router.get("/api/instructor", getAllInstructors);
router.get("/api/instructor/:id", getInstructorById);

// Protected routes
router.post("/api/instructor/signup", verifyAdmin, createInstructor);
router.put("/api/instructor/:id", verifyInstructor, updateInstructor);
router.delete("/api/instructor/:id", verifyInstructor, deleteInstructor);
router.post("/api/instructor/:id/courses", verifyInstructor, addCourse);
router.delete("/api/instructor/:id/courses", verifyInstructor, removeCourse);

export default router;
