import express from "express";

//Initialize the Express application
const app = express();

app.use(express.json());
// Middleware to parse JSON request bodies
//This is a built-in middleware function in Express.
// //It parses incoming requests with JSON payloads

// Define the port number
const PORT = 3000;

const users = [
  {
    id: 1,
    name: "John Doe",
    email: "johndoe@gmail.com",
    password: "123456",
    age: 30,
    isMarried: false,
    address: "123 Main St, Anytown, USA",
    hobbies: ["reading", "traveling", "coding"],
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@gmail.com",
    password: "122456",
    age: 25,
    isMarried: true,
    address: "456 Elm St, Anytown, USA",
    hobbies: ["cooking", "hiking", "painting"],
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bobdjon@gmail.com",
    password: "12992s56",
    age: 40,
    isMarried: false,
    address: "789 Oak St, Anytown, USA",
    hobbies: ["gaming", "photography", "music"],
  },
  {
    id: 4,
    name: "Alice Brown",
    email: "alicebrown@gmail.com",
    password: "1222256",
    age: 35,
    isMarried: true,
    address: "101 Pine St, Anytown, USA",
    hobbies: ["writing", "traveling", "yoga"],
  },
  {
    id: 5,
    name: "Charlie Davis",
    email: "charlie@gmail.com",
    password: "122456",
    age: 28,
    isMarried: false,
    address: "202 Maple St, Anytown, USA",
    hobbies: ["sports", "cooking", "reading"],
  },
];

// GET route for the root URL
app.get("/", (req, res) => {
  res.send("Au Revior!");
});

app.get("/users", (req, res) => {
  console.log(req, "res gotten");
  res.json({
    length: users.length,
    users: users,
  });
});

// get route for a specific user by ID

app.get("/users/:userId", (req, res) => {
  const userId = req.params.userId;
  const user = users.find((user) => user.id === parseInt(userId));
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// POST route to add a new user
app.post("/users", (req, res) => {
  const newUser = req.body;
  console.log(newUser, "new user data");

  //Validate the new user data
  if (!newUser.name || !newUser.email || !newUser.password || !newUser.age) {
    return res
      .status(400)
      .json({ message: "Name, email, age, and password are required" });
  }

  if (newUser.age < 16) {
    return res.status(400).json({ message: "Age must be at least 16" });
  }

  // Check if the user already exists
  const userExists = users.some((user) => user.email === newUser.email);
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Assign a new ID to the user
  const newId = users.length + 1;

  const userToAdd = { id: newId, ...newUser };
  users.push(userToAdd);
  res.status(201).json(userToAdd);
});

// Delete user by ID

app.delete("/users/:userId", (req, res) => {
  const userId = req.params.userId;
  const userIndex = users.findIndex((user) => user.id === parseInt(userId));

  if (userIndex !== -1) {
    users.splice(userIndex, 1);
    res.status(204).json({ message: "Deleted Selected" }); // No content
  } else {
    res.status(404).json({ message: "User not found" });
  }
});


// Update user by Id (PUT method)
// Search User (query parameter)

//200 - Sucess /OK
//201 - Created
//202 - Accepted
//204 - No Content

//400 - Bad Request
//401 - Unauthorized
//402 - Payment Required
//403 - Forbidden
//404 - Not Found

// app.METHOD(PATH, HANDLER)
// app is an instance of express.
// METHOD is an HTTP request method, in lowercase.
// PATH is a path on the server.
// HANDLER is the function executed when the route is matched.

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
