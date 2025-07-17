import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import userRoutes from "./routes/v1/users.js";
import claimRoutes from "./routes/v1/claim.js";
import leaderboardRoutes from "./routes/v1/leaderboard.js";
import errorHandler from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors());
app.use(express.json());

// Routes (v1)
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/claim", claimRoutes);
app.use("/api/v1/leaderboard", leaderboardRoutes);

// Error handler
app.use(errorHandler);

// Connect DB & Start Server
const startServer = async () => {
	try {
		await mongoose.connect(MONGO_URI);
		console.log("MongoDB connected");

		app.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`);
		});
	} catch (err) {
		console.error("Connection error:", err.message);
		process.exit(1);
	}
};

startServer();
