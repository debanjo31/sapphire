import {
  validateProduct,
  validateProductUpdate,
  validateStockUpdate,
  validateStockAdjustment,
} from "../validation/product.js";
import prisma from "../prisma.js";

// Create a new product in a store (Admin only)
export const createProduct = async (req, res) => {
  try {
    const { storeId } = req.params;
    const storeIdInt = parseInt(storeId);

    if (isNaN(storeIdInt)) {
      return res.status(400).json({ message: "Invalid store ID" });
    }

    const { valid, errors } = validateProduct(req.body);
    if (!valid) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors,
      });
    }

    const { name, description, price, stock } = req.body;

    // Check if store exists
    const store = await prisma.store.findUnique({
      where: { id: storeIdInt },
    });

    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    // Check if product with same name already exists in this store
    const existingProduct = await prisma.product.findFirst({
      where: {
        name,
        storeId: storeIdInt,
      },
    });

    if (existingProduct) {
      return res.status(400).json({
        message: "Product with this name already exists in this store",
      });
    }

    // Create the product
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock: stock || 0,
        storeId: storeIdInt,
      },
      include: {
        store: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
      },
    });

    res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Error creating product" });
  }
};

// Get all products in a store
export const getStoreProducts = async (req, res) => {
  try {
    const { storeId } = req.params;
    const storeIdInt = parseInt(storeId);

    if (isNaN(storeIdInt)) {
      return res.status(400).json({ message: "Invalid store ID" });
    }

    // Check if store exists
    const store = await prisma.store.findUnique({
      where: { id: storeIdInt },
      select: {
        id: true,
        name: true,
        address: true,
      },
    });

    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    // Get products with pagination support
    const { page = 1, limit = 20, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const whereClause = {
      storeId: storeIdInt,
      ...(search && {
        name: {
          contains: search,
          mode: "insensitive",
        },
      }),
    };

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        skip,
        take: parseInt(limit),
        orderBy: {
          createdAt: "desc",
        },
        include: {
          store: {
            select: {
              id: true,
              name: true,
              address: true,
            },
          },
        },
      }),
      prisma.product.count({
        where: whereClause,
      }),
    ]);

    res.status(200).json({
      message: "Products retrieved successfully",
      store,
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalCount,
        hasNextPage: skip + parseInt(limit) < totalCount,
        hasPreviousPage: parseInt(page) > 1,
      },
    });
  } catch (error) {
    console.error("Error retrieving products:", error);
    res.status(500).json({ message: "Error retrieving products" });
  }
};

// Get all products across all stores (Admin only)
export const getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, storeId } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const whereClause = {
      ...(search && {
        name: {
          contains: search,
          mode: "insensitive",
        },
      }),
      ...(storeId && {
        storeId: parseInt(storeId),
      }),
    };

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        skip,
        take: parseInt(limit),
        orderBy: {
          createdAt: "desc",
        },
        include: {
          store: {
            select: {
              id: true,
              name: true,
              address: true,
            },
          },
        },
      }),
      prisma.product.count({
        where: whereClause,
      }),
    ]);

    res.status(200).json({
      message: "Products retrieved successfully",
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalCount,
        hasNextPage: skip + parseInt(limit) < totalCount,
        hasPreviousPage: parseInt(page) > 1,
      },
    });
  } catch (error) {
    console.error("Error retrieving products:", error);
    res.status(500).json({ message: "Error retrieving products" });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const { storeId, productId } = req.params;
    const storeIdInt = parseInt(storeId);
    const productIdInt = parseInt(productId);

    if (isNaN(storeIdInt) || isNaN(productIdInt)) {
      return res
        .status(400)
        .json({ message: "Invalid store ID or product ID" });
    }

    const product = await prisma.product.findFirst({
      where: {
        id: productIdInt,
        storeId: storeIdInt,
      },
      include: {
        store: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
      },
    });

    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found in this store" });
    }

    res.status(200).json({
      message: "Product retrieved successfully",
      product,
    });
  } catch (error) {
    console.error("Error retrieving product:", error);
    res.status(500).json({ message: "Error retrieving product" });
  }
};

// Update product (Admin only)
export const updateProduct = async (req, res) => {
  try {
    const { storeId, productId } = req.params;
    const storeIdInt = parseInt(storeId);
    const productIdInt = parseInt(productId);

    if (isNaN(storeIdInt) || isNaN(productIdInt)) {
      return res
        .status(400)
        .json({ message: "Invalid store ID or product ID" });
    }

    const { valid, errors } = validateProductUpdate(req.body);
    if (!valid) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors,
      });
    }

    const { name, description, price, stock } = req.body;

    // Check if product exists in the store
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: productIdInt,
        storeId: storeIdInt,
      },
    });

    if (!existingProduct) {
      return res
        .status(404)
        .json({ message: "Product not found in this store" });
    }

    // If updating name, check if the new name already exists in this store
    if (name && name !== existingProduct.name) {
      const nameExists = await prisma.product.findFirst({
        where: {
          name,
          storeId: storeIdInt,
          id: {
            not: productIdInt,
          },
        },
      });

      if (nameExists) {
        return res.status(400).json({
          message: "Product with this name already exists in this store",
        });
      }
    }

    // Update the product
    const updatedProduct = await prisma.product.update({
      where: { id: productIdInt },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(price && { price }),
        ...(stock !== undefined && { stock }),
      },
      include: {
        store: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
      },
    });

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Error updating product" });
  }
};

// Update product stock (Admin only)
export const updateProductStock = async (req, res) => {
  try {
    const { storeId, productId } = req.params;
    const storeIdInt = parseInt(storeId);
    const productIdInt = parseInt(productId);

    if (isNaN(storeIdInt) || isNaN(productIdInt)) {
      return res
        .status(400)
        .json({ message: "Invalid store ID or product ID" });
    }

    const { valid, errors } = validateStockUpdate(req.body);
    if (!valid) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors,
      });
    }

    const { stock } = req.body;

    // Check if product exists in the store
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: productIdInt,
        storeId: storeIdInt,
      },
    });

    if (!existingProduct) {
      return res
        .status(404)
        .json({ message: "Product not found in this store" });
    }

    // Update the stock
    const updatedProduct = await prisma.product.update({
      where: { id: productIdInt },
      data: { stock },
      include: {
        store: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
      },
    });

    res.status(200).json({
      message: "Product stock updated successfully",
      product: updatedProduct,
      previousStock: existingProduct.stock,
    });
  } catch (error) {
    console.error("Error updating product stock:", error);
    res.status(500).json({ message: "Error updating product stock" });
  }
};

// Adjust product stock (Admin only) - add or subtract from current stock
export const adjustProductStock = async (req, res) => {
  try {
    const { storeId, productId } = req.params;
    const storeIdInt = parseInt(storeId);
    const productIdInt = parseInt(productId);

    if (isNaN(storeIdInt) || isNaN(productIdInt)) {
      return res
        .status(400)
        .json({ message: "Invalid store ID or product ID" });
    }

    const { valid, errors } = validateStockAdjustment(req.body);
    if (!valid) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors,
      });
    }

    const { adjustment } = req.body;

    // Check if product exists in the store
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: productIdInt,
        storeId: storeIdInt,
      },
    });

    if (!existingProduct) {
      return res
        .status(404)
        .json({ message: "Product not found in this store" });
    }

    const newStock = existingProduct.stock + adjustment;

    // Ensure stock doesn't go below 0
    if (newStock < 0) {
      return res.status(400).json({
        message: `Insufficient stock. Current stock: ${existingProduct.stock}, Adjustment: ${adjustment}`,
      });
    }

    // Update the stock
    const updatedProduct = await prisma.product.update({
      where: { id: productIdInt },
      data: { stock: newStock },
      include: {
        store: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
      },
    });

    res.status(200).json({
      message: "Product stock adjusted successfully",
      product: updatedProduct,
      previousStock: existingProduct.stock,
      adjustment,
    });
  } catch (error) {
    console.error("Error adjusting product stock:", error);
    res.status(500).json({ message: "Error adjusting product stock" });
  }
};

// Delete product (Admin only)
export const deleteProduct = async (req, res) => {
  try {
    const { storeId, productId } = req.params;
    const storeIdInt = parseInt(storeId);
    const productIdInt = parseInt(productId);

    if (isNaN(storeIdInt) || isNaN(productIdInt)) {
      return res
        .status(400)
        .json({ message: "Invalid store ID or product ID" });
    }

    // Check if product exists in the store
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: productIdInt,
        storeId: storeIdInt,
      },
    });

    if (!existingProduct) {
      return res
        .status(404)
        .json({ message: "Product not found in this store" });
    }

    // Delete the product
    await prisma.product.delete({
      where: { id: productIdInt },
    });

    res.status(200).json({
      message: "Product deleted successfully",
      deletedProduct: {
        id: existingProduct.id,
        name: existingProduct.name,
        storeId: existingProduct.storeId,
      },
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Error deleting product" });
  }
};

// Get low stock products in a store (Admin only)
export const getLowStockProducts = async (req, res) => {
  try {
    const { storeId } = req.params;
    const storeIdInt = parseInt(storeId);
    const { threshold = 10 } = req.query;

    if (isNaN(storeIdInt)) {
      return res.status(400).json({ message: "Invalid store ID" });
    }

    // Check if store exists
    const store = await prisma.store.findUnique({
      where: { id: storeIdInt },
      select: {
        id: true,
        name: true,
        address: true,
      },
    });

    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    const lowStockProducts = await prisma.product.findMany({
      where: {
        storeId: storeIdInt,
        stock: {
          lte: parseInt(threshold),
        },
      },
      orderBy: {
        stock: "asc",
      },
      include: {
        store: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
      },
    });

    res.status(200).json({
      message: "Low stock products retrieved successfully",
      store,
      products: lowStockProducts,
      threshold: parseInt(threshold),
      count: lowStockProducts.length,
    });
  } catch (error) {
    console.error("Error retrieving low stock products:", error);
    res.status(500).json({ message: "Error retrieving low stock products" });
  }
};
