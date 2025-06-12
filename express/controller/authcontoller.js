import { users } from "../data/user.js";

export const signup = async (req, res) => {
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
};
