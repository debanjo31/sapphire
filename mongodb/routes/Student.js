import express from "express";
import {
  createSudent,
  getAllStudents,
  loginStudent,
} from "../controller/Student.js";
import { verifyAuth } from "../middleware/verifyAuth.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const router = express.Router();

router.post("/api/student", createSudent);
router.post("/api/student/login", loginStudent);
router.get("/api/student", verifyAuth, getAllStudents);

export default router;
