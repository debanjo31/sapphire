import express from "express";
import mongoose from "mongoose";
import studentRouter from "./routes/Student.js";
import adminRouter from "./routes/admin.js";
import courseRouter from "./routes/Course.js";
import cors from "cors";

const PORT = 8080;
const MONGO_URL = "mongodb://localhost:27017/dataforte";

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
