import User from "../models/User.js";
import ClaimHistory from "../models/ClaimHistory.js";

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

		res.status(200).json({ message: "Points claimed", user, claim });
	} catch (err) {
		next(err);
	}
};
