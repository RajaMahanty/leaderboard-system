import User from "../models/User.js";

// GET /api/v1/users
export const getUsers = async (req, res, next) => {
	try {
		const users = await User.find().sort({ createdAt: -1 });
		res.json(users);
	} catch (err) {
		next(err);
	}
};

// POST /api/v1/users
export const createUser = async (req, res, next) => {
	try {
		const { name } = req.body;
		if (!name) return res.status(400).json({ error: "Name is required" });

		const user = new User({ name, totalPoints: 0 });
		await user.save();
		res.status(201).json(user);
	} catch (err) {
		next(err);
	}
};
