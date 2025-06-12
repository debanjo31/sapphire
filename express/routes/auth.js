import express from "express";
import { signup } from "../controller/authcontoller.js";

const router = express.Router();

router.post("/api/signup", signup);
// add other routes

export default router;
