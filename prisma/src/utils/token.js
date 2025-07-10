import jwt from "jsonwebtoken";

const jwtsecret = "dataforte-secret";
// Function to generate a JWT token
export const generateToken = (userId, userType) => {
  const token = jwt.sign({ userId, userType }, jwtsecret, {
    expiresIn: "7d", // Token expiration time
  });
  return token;
};

export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, jwtsecret);
    return decoded; // Returns the decoded token if verification is successful
  } catch (error) {
    console.error("Token verification failed:", error);
    return null; // Returns null if verification fails
  }
};
