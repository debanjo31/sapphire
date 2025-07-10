import { validateManager, validateCashier } from "../validation/employee.js";
import prisma from "../prisma.js";

// Create a new manager (Admin only)
export const createManager = async (req, res) => {
  try {
    const { valid, errors } = validateManager(req.body);
    if (!valid) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors,
      });
    }

    const { userId, address, phone, nin } = req.body;

    // Check if user exists and has MANAGER role
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "MANAGER") {
      return res.status(400).json({ message: "User must have MANAGER role" });
    }

    // Check if manager profile already exists for this user
    const existingManager = await prisma.manager.findUnique({
      where: { userId },
    });

    if (existingManager) {
      return res
        .status(400)
        .json({ message: "Manager profile already exists for this user" });
    }

    // Create manager profile
    const newManager = await prisma.manager.create({
      data: {
        userId,
        address,
        phone,
        nin,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    res.status(201).json({
      message: "Manager created successfully",
      manager: newManager,
    });
  } catch (error) {
    console.error("Error creating manager:", error);
    res.status(500).json({ message: "Error creating manager" });
  }
};

// Create a new cashier (Admin only)
export const createCashier = async (req, res) => {
  try {
    const { valid, errors } = validateCashier(req.body);
    if (!valid) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors,
      });
    }

    const { userId, address, phone, nin, storeid } = req.body;

    // Check if user exists and has CASHIER role
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "CASHIER") {
      return res.status(400).json({ message: "User must have CASHIER role" });
    }

    // Check if cashier profile already exists for this user
    const existingCashier = await prisma.cashier.findUnique({
      where: { userId },
    });

    if (existingCashier) {
      return res
        .status(400)
        .json({ message: "Cashier profile already exists for this user" });
    }

    // If storeid is provided, check if store exists
    if (storeid) {
      const store = await prisma.store.findUnique({
        where: { id: storeid },
      });

      if (!store) {
        return res.status(404).json({ message: "Store not found" });
      }
    }

    // Create cashier profile
    const newCashier = await prisma.cashier.create({
      data: {
        userId,
        address,
        phone,
        nin,
        storeid,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
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

    res.status(201).json({
      message: "Cashier created successfully",
      cashier: newCashier,
    });
  } catch (error) {
    console.error("Error creating cashier:", error);
    res.status(500).json({ message: "Error creating cashier" });
  }
};

// Get all managers (Admin only)
export const getAllManagers = async (req, res) => {
  try {
    const managers = await prisma.manager.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
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
      message: "Managers retrieved successfully",
      managers,
    });
  } catch (error) {
    console.error("Error retrieving managers:", error);
    res.status(500).json({ message: "Error retrieving managers" });
  }
};

// Get all cashiers (Admin only)
export const getAllCashiers = async (req, res) => {
  try {
    const cashiers = await prisma.cashier.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
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
      message: "Cashiers retrieved successfully",
      cashiers,
    });
  } catch (error) {
    console.error("Error retrieving cashiers:", error);
    res.status(500).json({ message: "Error retrieving cashiers" });
  }
};

// Get available managers (not assigned to any store)
export const getAvailableManagers = async (req, res) => {
  try {
    const managers = await prisma.manager.findMany({
      where: {
        store: null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    res.status(200).json({
      message: "Available managers retrieved successfully",
      managers,
    });
  } catch (error) {
    console.error("Error retrieving available managers:", error);
    res.status(500).json({ message: "Error retrieving available managers" });
  }
};

// Get available cashiers (not assigned to any store)
export const getAvailableCashiers = async (req, res) => {
  try {
    const cashiers = await prisma.cashier.findMany({
      where: {
        storeid: null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    res.status(200).json({
      message: "Available cashiers retrieved successfully",
      cashiers,
    });
  } catch (error) {
    console.error("Error retrieving available cashiers:", error);
    res.status(500).json({ message: "Error retrieving available cashiers" });
  }
};
