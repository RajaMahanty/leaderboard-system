import User from "../models/User.js";

// GET /api/v1/leaderboard
export const getLeaderboard = async (req, res, next) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;
		const skip = (page - 1) * limit;

		const total = await User.countDocuments();
		const users = await User.find()
			.sort({ totalPoints: -1 })
			.skip(skip)
			.limit(limit);

		const leaderboard = users.map((user, index) => ({
			name: user.name,
			totalPoints: user.totalPoints,
			rank: skip + index + 1,
		}));

		const totalPages = Math.ceil(total / limit);

		res.json({
			leaderboard,
			total,
			page,
			totalPages,
		});
	} catch (err) {
		next(err);
	}
};
