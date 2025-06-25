import Student from "../models/Student.js";
import { comparePassword, hashPassword } from "../utils/hash.js";
import { generateToken } from "../utils/token.js";
import { validateStudent } from "../validation/student.js";

export const createSudent = async (req, res) => {
  try {
    const { firstName, lastName, password, email, age } = req.body;
    const verifyStudent = validateStudent(req.body);
    if (!verifyStudent.valid) {
      return res.status(400).json({
        message: "Validation error",
        errors: verifyStudent.errors,
      });
    }
    console.log(verifyStudent.value, "VALIDATED STUDENT DATA");
    const checkEmail = await Student.findOne({ email });
    if (checkEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const hashedPassword = hashPassword(password);
    const newStudent = new Student({
      firstName,
      lastName,
      password: hashedPassword,
      email,
      age,
    });
    await newStudent.save();
    // await Student.create({
    //   firstName,
    //   lastName,
    //   password,
    //   email,
    //   age,
    // });
    res
      .status(201)
      .json({ message: "Student created successfully", newStudent });
  } catch (error) {
    console.error(error, "ERROR CREATING STUDENT");
    res.status(500).json({ message: "Error creating student" });
  }
};

export const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    const student = await Student.findOne({ email });
    console.log(student, "STUDENT FOUND");
    if (!student) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isPasswordValid = comparePassword(password, student.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = generateToken(student._id, "student");
    res.status(200).json({ message: "Login successful", student, token });
  } catch (error) {
    console.error(error, "ERROR LOGGING IN STUDENT");
    res.status(500).json({ message: "Error logging in student" });
  }
};

export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json({ count: students.length, students });
  } catch (error) {
    console.error(error, "ERROR FETCHING STUDENTS");
    res.status(500).json({ message: "Error fetching students" });
  }
};
