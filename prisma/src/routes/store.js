import express from "express";
import {
  createStore,
  getAllStores,
  getStoreById,
  updateStore,
  assignManager,
  assignCashier,
  removeManager,
  removeCashier,
  deleteStore,
} from "../controller/store.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const router = express.Router();

// Create a new store (Admin only)
router.post("/api/stores", verifyAdmin, createStore);

// Get all stores (Admin only)
router.get("/api/stores", verifyAdmin, getAllStores);

// Get store by ID (Admin only)
router.get("/api/stores/:id", verifyAdmin, getStoreById);

// Update store (Admin only)
router.put("/api/stores/:id", verifyAdmin, updateStore);

// Assign manager to store (Admin only)
router.post("/api/stores/:id/assign-manager", verifyAdmin, assignManager);

// Assign cashier to store (Admin only)
router.post("/api/stores/:id/assign-cashier", verifyAdmin, assignCashier);

// Remove manager from store (Admin only)
router.delete("/api/stores/:id/remove-manager", verifyAdmin, removeManager);

// Remove cashier from store (Admin only)
router.delete(
  "/api/stores/:storeId/remove-cashier/:cashierId",
  verifyAdmin,
  removeCashier
);

// Delete store (Admin only)
router.delete("/api/stores/:id", verifyAdmin, deleteStore);

export default router;
