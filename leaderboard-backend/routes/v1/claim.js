import express from "express";
import { claimPoints } from "../../controllers/claimController.js";

const router = express.Router();

// Claim random points for a user
router.post("/", claimPoints);

export default router;
