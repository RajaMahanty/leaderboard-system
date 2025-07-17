import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const initialUsers = [
	"Rahul",
	"Kamal",
	"Sanak",
	"Raja",
	"Priya",
	"Amit",
	"Sneha",
	"Vikas",
	"Anjali",
	"Deepak",
];

async function seedUsers() {
	try {
		await mongoose.connect(MONGO_URI);
		console.log("Connected to MongoDB");

		for (const name of initialUsers) {
			const exists = await User.findOne({ name });
			if (!exists) {
				await User.create({ name });
				console.log(`User '${name}' created.`);
			} else {
				console.log(`User '${name}' already exists.`);
			}
		}

		await mongoose.disconnect();
		console.log("Seeding complete. Disconnected from MongoDB.");
		process.exit(0);
	} catch (err) {
		console.error("Seeding error:", err);
		process.exit(1);
	}
}

seedUsers();
