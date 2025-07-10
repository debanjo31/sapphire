import express from "express";
import {
  createManager,
  createCashier,
  getAllManagers,
  getAllCashiers,
  getAvailableManagers,
  getAvailableCashiers,
} from "../controller/employee.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const router = express.Router();

// Create a new manager (Admin only)
router.post("/api/managers", verifyAdmin, createManager);

// Create a new cashier (Admin only)
router.post("/api/cashiers", verifyAdmin, createCashier);

// Get all managers (Admin only)
router.get("/api/managers", verifyAdmin, getAllManagers);

// Get all cashiers (Admin only)
router.get("/api/cashiers", verifyAdmin, getAllCashiers);

// Get available managers (not assigned to any store)
router.get("/api/managers/available", verifyAdmin, getAvailableManagers);

// Get available cashiers (not assigned to any store)
router.get("/api/cashiers/available", verifyAdmin, getAvailableCashiers);

export default router;
