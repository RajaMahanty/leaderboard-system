import express from "express";
import { getLeaderboard } from "../../controllers/leaderboardController.js";

const router = express.Router();

// Get leaderboard (sorted users with ranks)
router.get("/", getLeaderboard);

export default router;
