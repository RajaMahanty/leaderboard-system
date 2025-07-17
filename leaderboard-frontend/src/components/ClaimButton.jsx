import toast from "react-hot-toast";
import { apiFetch } from "../api/client";

export default function ClaimButton({ userId, onSuccess }) {
	const handleClick = async () => {
		try {
			const data = await apiFetch("/api/v1/claim", {
				method: "POST",
				body: { userId },
			});
			// Remove toast here, let parent handle it
			onSuccess?.(data);
		} catch (err) {
			toast.error(err.message);
		}
	};

	return (
		<button
			onClick={handleClick}
			disabled={!userId}
			className="glass px-6 py-2 rounded-xl font-semibold text-black shadow hover:bg-white/50 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
		>
			Claim Points
		</button>
	);
}
