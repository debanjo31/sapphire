import express from "express";
import {
  createProduct,
  getStoreProducts,
  getAllProducts,
  getProductById,
  updateProduct,
  updateProductStock,
  adjustProductStock,
  deleteProduct,
  getLowStockProducts,
} from "../controller/product.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const router = express.Router();

// Create a new product in a store (Admin only)
router.post("/api/stores/:storeId/products", verifyAdmin, createProduct);

// Get low stock products in a store (Admin only)
router.get(
  "/api/stores/:storeId/products/low-stock",
  verifyAdmin,
  getLowStockProducts
);

// Get all products in a store (Admin only)
router.get("/api/stores/:storeId/products", verifyAdmin, getStoreProducts);

// Get all products across all stores (Admin only)
router.get("/api/products", verifyAdmin, getAllProducts);

// Get product by ID in a specific store (Admin only)
router.get(
  "/api/stores/:storeId/products/:productId",
  verifyAdmin,
  getProductById
);

// Update product (Admin only)
router.put(
  "/api/stores/:storeId/products/:productId",
  verifyAdmin,
  updateProduct
);

// Update product stock (Admin only)
router.patch(
  "/api/stores/:storeId/products/:productId/stock",
  verifyAdmin,
  updateProductStock
);

// Adjust product stock (add/subtract) (Admin only)
router.patch(
  "/api/stores/:storeId/products/:productId/stock/adjust",
  verifyAdmin,
  adjustProductStock
);

// Delete product (Admin only)
router.delete(
  "/api/stores/:storeId/products/:productId",
  verifyAdmin,
  deleteProduct
);

export default router;
