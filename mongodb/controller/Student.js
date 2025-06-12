import Student from "../models/Student.js";

export const createSudent = async (req, res) => {
  try {
    const { firstName, lastName, password, email, age } = req.body;
    if (!firstName || !lastName || !password || !email || !age) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const checkEmail = await Student.findOne({ email });
    if (checkEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const newStudent = new Student({
      firstName,
      lastName,
      password,
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
    if (student.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    res.status(200).json({ message: "Login successful", student });
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
