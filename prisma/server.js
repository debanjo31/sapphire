import express from "express";
import adminRoute from "./src/routes/admin.js";
import storeRoute from "./src/routes/store.js";
import employeeRoute from "./src/routes/employee.js";
import productRoute from "./src/routes/product.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(adminRoute);
app.use(storeRoute);
app.use(employeeRoute);
app.use(productRoute);
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

console.log("Server setup complete");
