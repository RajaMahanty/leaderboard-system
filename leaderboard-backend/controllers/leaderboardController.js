import User from "../models/User.js";

// GET /api/v1/leaderboard
export const getLeaderboard = async (req, res, next) => {
	try {
		const users = await User.find().sort({ totalPoints: -1 });

		const leaderboard = users.map((user, index) => ({
			name: user.name,
			totalPoints: user.totalPoints,
			rank: index + 1,
		}));

		res.json(leaderboard);
	} catch (err) {
		next(err);
	}
};
