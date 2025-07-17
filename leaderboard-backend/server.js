import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import http from "http";

import userRoutes from "./routes/v1/users.js";
import claimRoutes from "./routes/v1/claim.js";
import leaderboardRoutes from "./routes/v1/leaderboard.js";
import errorHandler from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();
const server = http.createServer(app); // ✅ Needed for Socket.IO

// Create and export Socket.IO instance
export const io = new Server(server, {
	cors: {
		origin: "*", // Adjust this if needed
		methods: ["GET", "POST"],
	},
});

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
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

const startServer = async () => {
	try {
		await mongoose.connect(MONGO_URI);
		console.log("MongoDB connected");

		server.listen(PORT, () => {
			console.log(`Server + Socket.IO running on port ${PORT}`);
		});

		// Optional: log when a client connects
		io.on("connection", (socket) => {
			console.log("Client connected:", socket.id);
		});
	} catch (err) {
		console.error("Connection error:", err.message);
		process.exit(1);
	}
};
startServer();
