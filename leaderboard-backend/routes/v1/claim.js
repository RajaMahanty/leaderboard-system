import express from "express";
import {
	claimPoints,
	getClaimHistory,
} from "../../controllers/claimController.js";

const router = express.Router();

// Claim random points for a user
router.post("/", claimPoints);

// Get claim history
router.get("/history", getClaimHistory);

export default router;
