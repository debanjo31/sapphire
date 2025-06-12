import express from "express";
import {
  createSudent,
  getAllStudents,
  loginStudent,
} from "../controller/Student.js";

const router = express.Router();

router.post("/api/student", createSudent);
router.get("/api/student", getAllStudents);
router.post("/api/student/login", loginStudent);

export default router;
