import express from "express";
import authRouter from "./routes/auth.js";
import adminRouter from "./routes/admin.js";
//Initialize the Express application
const app = express();
app.use(express.json());

// Define the port number
const PORT = 8080;

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

app.use(authRouter);
app.use(adminRouter);

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
