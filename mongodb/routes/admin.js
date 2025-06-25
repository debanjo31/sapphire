import express from "express";
import {
  adminSignup,
  loginAdmin,
  getAdminProfile,
} from "../controller/admin.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const router = express.Router();

router.post("/api/admin/signup", adminSignup);
router.post("/api/admin/login", loginAdmin); // Assuming loginAdmin is also handled by adminSignup for simplicity
router.get("/api/admin/profile", verifyAdmin, getAdminProfile);

export default router;
