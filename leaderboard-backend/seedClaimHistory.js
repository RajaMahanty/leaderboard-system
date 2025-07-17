import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import ClaimHistory from "./models/ClaimHistory.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function seedClaimHistory() {
	try {
		await mongoose.connect(MONGO_URI);
		console.log("Connected to MongoDB");

		const users = await User.find();
		if (users.length === 0) {
			console.log("No users found. Please seed users first.");
			process.exit(1);
		}

		for (const user of users) {
			for (let i = 0; i < 5; i++) {
				const points = getRandomInt(1, 10);
				await ClaimHistory.create({ user: user._id, points });
				console.log(
					`Claim for user '${user.name}' with ${points} pts created.`
				);
			}
		}

		await mongoose.disconnect();
		console.log("Claim history seeding complete. Disconnected from MongoDB.");
		process.exit(0);
	} catch (err) {
		console.error("Seeding error:", err);
		process.exit(1);
	}
}

seedClaimHistory();
