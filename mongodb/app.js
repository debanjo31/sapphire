import express from "express";
import mongoose from "mongoose";
import studentRouter from "./routes/Student.js";
import adminRouter from "./routes/admin.js";
import courseRouter from "./routes/Course.js";
import instructorRouter from "./routes/Instructor.js";
import cors from "cors";

const PORT = 8080;
const MONGO_URL = "mongodb+srv://adebanjoisrael31:pass1234;@chat-app.n8mrv2v.mongodb.net/";

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.get("/", (req, res) => {
  res.send("Hello, World!");
});
app.use(studentRouter);
app.use(adminRouter);
app.use(courseRouter);
app.use(instructorRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
