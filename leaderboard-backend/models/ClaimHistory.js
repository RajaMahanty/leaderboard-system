import mongoose from "mongoose";

const claimHistorySchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		points: {
			type: Number,
			required: true,
			min: 1,
			max: 10,
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.model("ClaimHistory", claimHistorySchema);
