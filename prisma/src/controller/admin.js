import { validateAdmin } from "../validation/admin.js";
import { comparePassword, hashPassword } from "../utils/hash.js";
import { generateToken } from "../utils/token.js";
import prisma from "../prisma.js";

export const adminSignup = async (req, res) => {
  try {
    const { valid, errors, value } = validateAdmin(req.body);
    if (!valid) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors,
      });
    }
    const { name, email, password } = req.body;
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = hashPassword(password);

    // Create new admin
    const newAdmin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "ADMIN", // Assuming role is set to ADMIN for all admins
      },
    });

    console.log("New admin created:", newAdmin);

    if (!newAdmin) {
      return res.status(500).json({ message: "Error creating admin" });
    }

    res.status(201).json({ message: "Admin created successfully", newAdmin });
  } catch (error) {
    console.error("Error creating admin:", error);
    res.status(500).json({ message: "Error creating admin" });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    const admin = await prisma.user.findUnique({
      where: { email },
    });
    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isPasswordValid = comparePassword(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = generateToken(admin._id, "admin");
    res.status(200).json({
      message: "Login successful",
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
      },
      token,
    });
  } catch (error) {
    console.error(error, "ERROR LOGGING IN admin");
    res.status(500).json({ message: "Error logging in admin" });
  }
};

export const getAdminProfile = async (req, res) => {
  try {
    const adminId = req.userId; // Assuming req.adminId is set by authentication middleware
    const admin = await prisma.user.findUnique({
      where: { id: adminId },
      include: { password: false },
    });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json({ admin });
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    res.status(500).json({ message: "Error fetching admin profile" });
  }
};
