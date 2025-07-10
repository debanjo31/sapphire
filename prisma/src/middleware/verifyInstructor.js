import { verifyToken } from "../utils/token.js";

export const verifyInstructor = (req, res, next) => {
  console.log("Authorization header:", req.headers.authorization);
  // Bearer ssksksk
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header
  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized, Please login to continue" });
  }
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: "Unauthorized, Invalid token" });
  }
  console.log("Decoded token:", decoded);
  if (decoded.userType !== "instructor") {
    return res.status(403).json({ message: "Forbidden, Instructors only" });
  }
  req.userId = decoded.userId; // Attach userId to request object
  req.userType = decoded.userType; // Attach userType to request object
  next();
};
