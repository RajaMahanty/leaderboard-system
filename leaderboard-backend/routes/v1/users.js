import express from "express";
import { getUsers, createUser } from "../../controllers/userController.js";

const router = express.Router();

// Get all users
router.get("/", getUsers);

// Add a new user
router.post("/", createUser);

export default router;
