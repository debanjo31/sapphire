import jwt from "jsonwebtoken";

//JWT is for verifying the user authentication
//JWT consist of three parts: header, payload, and signature

function generateToken() {
  const payload = {
    userId: "12345",
    userType: "student",
  };
  const secret = "my-jwt-secret"; // Replace with your secret key
  const options = {
    expiresIn: "120s", // Token expiration time
  };
  jwt.sign(payload, secret, options, (err, token) => {
    if (err) {
      console.error("Error generating token:", err);
      return null;
    }
    console.log("Generated Token:", token);
    return token;
  });
}

function verifyToken(token) {
  const decoded = jwt.verify(token, "my-jwt-secret", (err, decoded) => {
    if (err) {
      console.error("Error verifying token:", err);
      return null;
    }
    console.log("Decoded Token:", decoded);
    return decoded;
  });
}

// const newToken = generateToken();
// console.log("New Token:", newToken);

const token = verifyToken(
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NSIsInVzZXJUeXBlIjoic3R1ZGVudCIsImlhdCI6MTc1MDI1Mjg5MiwiZXhwIjoxNzUwMjUzMDEyfQ.ex54TZSeEW8CWa1LzseLF1UFm5mby59zanaxXlu_Ugk"
);
console.log("Verified Token:", token);
