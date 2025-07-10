import jwt from "jsonwebtoken";

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
