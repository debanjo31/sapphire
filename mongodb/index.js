import express from "express";
import { MongoClient, ObjectId } from "mongodb";


const app = express();
const PORT = 8080;
app.use(express.json());
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

// Database Name
const dbName = "myProject";
// It will create the database if it does not exist

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB server");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

connectDB();

const db = client.db(dbName);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/users", async (req, res) => {
  try {
    const user = await db.collection("users").find().toArray();
    res.status(200).json({
      users: user,
      count: user.length,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Error fetching users");
  }
});

app.get("/api/admin", async (req, res) => {
  try {
    const user = await db.collection("admin").find().toArray();
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Error fetching users");
  }
});

app.get("/api/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    console.log("Fetching user with ID:", userId);
    const convertedId = new ObjectId(userId);
    console.log("Converted ID:", convertedId);
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).send("Error fetching user by ID");
  }
});

app.post("/api/users", async (req, res) => {
  const newUser = req.body;
  try {
    const result = await db.collection("users").insertOne(newUser);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send("Error creating user");
  }
});

app.put("/api/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUser = req.body;
    const result = await db
      .collection("users")
      .updateOne({ _id: new ObjectId(userId) }, { $set: updatedUser });

    if (result.matchedCount === 0) {
      return res.status(404).send("User not found");
    }

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send("Error updating user");
  }
});

app.post("/api/admin", async (req, res) => {
  const newAdmin = req.body;
  try {
    const result = await db.collection("admin").insertOne(newAdmin);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error creating admin:", error);
    res.status(500).send("Error creating admin");
  }
});

app.delete("/api/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const result = await db
      .collection("users")
      .deleteOne({ _id: new ObjectId(userId) });
    if (result.deletedCount === 0) {
      return res.status(404).send("User not found");
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send("Error deleting user");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

//CRUD
// CREATE - insertOne, insertMany
// READ - find, findOne
// UPDATE - updateOne, updateMany
// DELETE  - deleteOne, deleteMany
