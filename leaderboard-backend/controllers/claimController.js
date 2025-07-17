import User from "../models/User.js";
import ClaimHistory from "../models/ClaimHistory.js";
import { io } from "../server.js";

// POST /api/v1/claim
export const claimPoints = async (req, res, next) => {
	try {
		const { userId } = req.body;
		if (!userId) return res.status(400).json({ error: "User ID is required" });

		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ error: "User not found" });

		const points = Math.floor(Math.random() * 10) + 1;
		user.totalPoints += points;
		await user.save();

		const claim = new ClaimHistory({ user: user._id, points });
		await claim.save();

		// Emit updated leaderboard
		const allUsers = await User.find().sort({ totalPoints: -1 });
		io.emit("leaderboardUpdated", allUsers);

		// Emit claim history item
		io.emit("claimAdded", {
			_id: claim._id,
			user: { _id: user._id, name: user.name },
			points: claim.points,
			createdAt: claim.createdAt,
		});

		res.status(200).json({ message: "Points claimed", user, claim });
	} catch (err) {
		next(err);
	}
};

// GET /api/v1/claim/history
export const getClaimHistory = async (req, res, next) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;
		const skip = (page - 1) * limit;

		const [history, total] = await Promise.all([
			ClaimHistory.find()
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(limit)
				.populate("user", "name"),
			ClaimHistory.countDocuments(),
		]);

		res.json({
			claims: history,
			page,
			totalPages: Math.ceil(total / limit),
			total,
		});
	} catch (err) {
		next(err);
	}
};
