import { validateAdmin } from "../validation/admin.js";
import Admin from "../models/Admin.js";
import { comparePassword, hashPassword } from "../utils/hash.js";
import { generateToken } from "../utils/token.js";

export const adminSignup = async (req, res) => {
  try {
    const { error, value } = validateAdmin(req.body);
    if (error) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.details.map((detail) => detail.message),
      });
    }
    const { firstName, lastName, email, password } = req.body;
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = hashPassword(password);

    // Create new admin
    const newAdmin = new Admin({
      firstName,
      lastName,
      email,
      password: hashedPassword, // Password should be hashed in a real application
    });

    await newAdmin.save();
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
    const admin = await Admin.findOne({ email }).select("+password"); // Ensure password is included for comparison
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
        firstName: admin.firstName,
        lastName: admin.lastName,
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
    const admin = await Admin.findById(adminId); // Exclude password from response
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json({ admin });
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    res.status(500).json({ message: "Error fetching admin profile" });
  }
};
