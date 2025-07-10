import {
  validateStore,
  validateStoreUpdate,
  validateManagerAssignment,
  validateCashierAssignment,
} from "../validation/store.js";
import prisma from "../prisma.js";

// Create a new store (Admin only)
export const createStore = async (req, res) => {
  try {
    const { valid, errors } = validateStore(req.body);
    if (!valid) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors,
      });
    }

    const { name, address, managerId } = req.body;

    // Check if store name already exists
    const existingStore = await prisma.store.findUnique({
      where: { name },
    });

    if (existingStore) {
      return res.status(400).json({ message: "Store name already exists" });
    }

    // If managerId is provided, check if manager exists and is available
    if (managerId) {
      const manager = await prisma.manager.findUnique({
        where: { id: managerId },
        include: { store: true },
      });

      if (!manager) {
        return res.status(404).json({ message: "Manager not found" });
      }

      if (manager.store) {
        return res
          .status(400)
          .json({ message: "Manager is already assigned to another store" });
      }
    }

    // Create the store
    const newStore = await prisma.store.create({
      data: {
        name,
        address,
        ...(managerId && { managerId }), // Only include managerId if it is provided
      },
    });

    res.status(201).json({
      message: "Store created successfully",
      store: newStore,
    });
  } catch (error) {
    console.error("Error creating store:", error);
    res.status(500).json({ message: "Error creating store" });
  }
};

// Get all stores
export const getAllStores = async (req, res) => {
  try {
    const stores = await prisma.store.findMany({
      include: {
        manager: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        cashiers: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        products: true,
      },
    });

    res.status(200).json({
      message: "Stores retrieved successfully",
      stores,
    });
  } catch (error) {
    console.error("Error retrieving stores:", error);
    res.status(500).json({ message: "Error retrieving stores" });
  }
};

// Get store by ID
export const getStoreById = async (req, res) => {
  try {
    const { id } = req.params;
    const storeId = parseInt(id);

    if (isNaN(storeId)) {
      return res.status(400).json({ message: "Invalid store ID" });
    }

    const store = await prisma.store.findUnique({
      where: { id: storeId },
      include: {
        manager: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        cashiers: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        products: {
          select: {
            id: true,
            name: true,
            price: true,
            stock: true,
          },
        },
      },
    });

    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    res.status(200).json({
      message: "Store retrieved successfully",
      store,
    });
  } catch (error) {
    console.error("Error retrieving store:", error);
    res.status(500).json({ message: "Error retrieving store" });
  }
};

// Update store (Admin only)
export const updateStore = async (req, res) => {
  try {
    const { id } = req.params;
    const storeId = parseInt(id);

    if (isNaN(storeId)) {
      return res.status(400).json({ message: "Invalid store ID" });
    }

    const { valid, errors } = validateStoreUpdate(req.body);
    if (!valid) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors,
      });
    }

    const { name, address, managerId } = req.body;

    // Check if store exists
    const existingStore = await prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!existingStore) {
      return res.status(404).json({ message: "Store not found" });
    }

    // If updating name, check if the new name already exists
    if (name && name !== existingStore.name) {
      const nameExists = await prisma.store.findUnique({
        where: { name },
      });

      if (nameExists) {
        return res.status(400).json({ message: "Store name already exists" });
      }
    }

    // If managerId is provided, check if manager exists and is available
    if (managerId !== undefined) {
      if (managerId !== null) {
        const manager = await prisma.manager.findUnique({
          where: { id: managerId },
          include: { store: true },
        });

        if (!manager) {
          return res.status(404).json({ message: "Manager not found" });
        }

        if (manager.store && manager.store.id !== storeId) {
          return res
            .status(400)
            .json({ message: "Manager is already assigned to another store" });
        }
      }
    }

    // Update the store
    const updatedStore = await prisma.store.update({
      where: { id: storeId },
      data: {
        ...(name && { name }),
        ...(address && { address }),
        ...(managerId !== undefined && { managerId }),
      },
      include: {
        manager: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        cashiers: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    res.status(200).json({
      message: "Store updated successfully",
      store: updatedStore,
    });
  } catch (error) {
    console.error("Error updating store:", error);
    res.status(500).json({ message: "Error updating store" });
  }
};

// Assign manager to store (Admin only)
export const assignManager = async (req, res) => {
  try {
    const { id } = req.params;
    const storeId = parseInt(id);

    if (isNaN(storeId)) {
      return res.status(400).json({ message: "Invalid store ID" });
    }

    const { valid, errors } = validateManagerAssignment(req.body);
    if (!valid) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors,
      });
    }

    const { managerId } = req.body;

    // Check if store exists
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      include: { manager: true },
    });

    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    // Check if manager exists and is available
    const manager = await prisma.manager.findUnique({
      where: { id: managerId },
      include: { store: true },
    });

    if (!manager) {
      return res.status(404).json({ message: "Manager not found" });
    }

    if (manager.store && manager.store.id !== storeId) {
      return res
        .status(400)
        .json({ message: "Manager is already assigned to another store" });
    }

    // Assign manager to store
    const updatedStore = await prisma.store.update({
      where: { id: storeId },
      data: { managerId },
      include: {
        manager: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    res.status(200).json({
      message: "Manager assigned successfully",
      store: updatedStore,
    });
  } catch (error) {
    console.error("Error assigning manager:", error);
    res.status(500).json({ message: "Error assigning manager" });
  }
};

// Assign cashier to store (Admin only)
export const assignCashier = async (req, res) => {
  try {
    const { id } = req.params;
    const storeId = parseInt(id);

    if (isNaN(storeId)) {
      return res.status(400).json({ message: "Invalid store ID" });
    }

    const { valid, errors } = validateCashierAssignment(req.body);
    if (!valid) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors,
      });
    }

    const { cashierId } = req.body;

    // Check if store exists
    const store = await prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    // Check if cashier exists
    const cashier = await prisma.cashier.findUnique({
      where: { id: cashierId },
      include: { store: true },
    });

    if (!cashier) {
      return res.status(404).json({ message: "Cashier not found" });
    }

    if (cashier.store && cashier.store.id !== storeId) {
      return res
        .status(400)
        .json({ message: "Cashier is already assigned to another store" });
    }

    // Assign cashier to store
    const updatedCashier = await prisma.cashier.update({
      where: { id: cashierId },
      data: { storeid: storeId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
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
      message: "Cashier assigned successfully",
      cashier: updatedCashier,
    });
  } catch (error) {
    console.error("Error assigning cashier:", error);
    res.status(500).json({ message: "Error assigning cashier" });
  }
};

// Remove manager from store (Admin only)
export const removeManager = async (req, res) => {
  try {
    const { id } = req.params;
    const storeId = parseInt(id);

    if (isNaN(storeId)) {
      return res.status(400).json({ message: "Invalid store ID" });
    }

    // Check if store exists
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      include: { manager: true },
    });

    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    if (!store.manager) {
      return res
        .status(400)
        .json({ message: "No manager assigned to this store" });
    }

    // Remove manager from store
    const updatedStore = await prisma.store.update({
      where: { id: storeId },
      data: { managerId: null },
      include: {
        cashiers: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    res.status(200).json({
      message: "Manager removed successfully",
      store: updatedStore,
    });
  } catch (error) {
    console.error("Error removing manager:", error);
    res.status(500).json({ message: "Error removing manager" });
  }
};

// Remove cashier from store (Admin only)
export const removeCashier = async (req, res) => {
  try {
    const { storeId, cashierId } = req.params;
    const storeIdInt = parseInt(storeId);
    const cashierIdInt = parseInt(cashierId);

    if (isNaN(storeIdInt) || isNaN(cashierIdInt)) {
      return res
        .status(400)
        .json({ message: "Invalid store ID or cashier ID" });
    }

    // Check if store exists
    const store = await prisma.store.findUnique({
      where: { id: storeIdInt },
    });

    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    // Check if cashier exists and is assigned to this store
    const cashier = await prisma.cashier.findUnique({
      where: { id: cashierIdInt },
      include: { store: true },
    });

    if (!cashier) {
      return res.status(404).json({ message: "Cashier not found" });
    }

    if (!cashier.store || cashier.store.id !== storeIdInt) {
      return res
        .status(400)
        .json({ message: "Cashier is not assigned to this store" });
    }

    // Remove cashier from store
    const updatedCashier = await prisma.cashier.update({
      where: { id: cashierIdInt },
      data: { storeid: null },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(200).json({
      message: "Cashier removed successfully",
      cashier: updatedCashier,
    });
  } catch (error) {
    console.error("Error removing cashier:", error);
    res.status(500).json({ message: "Error removing cashier" });
  }
};

// Delete store (Admin only)
export const deleteStore = async (req, res) => {
  try {
    const { id } = req.params;
    const storeId = parseInt(id);

    if (isNaN(storeId)) {
      return res.status(400).json({ message: "Invalid store ID" });
    }

    // Check if store exists
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      include: { products: true, cashiers: true },
    });

    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    // Check if store has products
    if (store.products && store.products.length > 0) {
      return res.status(400).json({
        message:
          "Cannot delete store with existing products. Please remove all products first.",
      });
    }

    // Remove all cashiers from the store before deletion
    if (store.cashiers && store.cashiers.length > 0) {
      await prisma.cashier.updateMany({
        where: { storeid: storeId },
        data: { storeid: null },
      });
    }

    // Delete the store
    await prisma.store.delete({
      where: { id: storeId },
    });

    res.status(200).json({
      message: "Store deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting store:", error);
    res.status(500).json({ message: "Error deleting store" });
  }
};
