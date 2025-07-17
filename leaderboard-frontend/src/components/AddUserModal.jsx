import { useState } from "react";
import { createUserSchema } from "../validators/userValidator";
import { toast } from "react-hot-toast";
import { apiFetch } from "../api/client";

export default function AddUserModal({ isOpen, onClose, onUserAdded }) {
	const [name, setName] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();

		const result = createUserSchema.safeParse({ name });
		if (!result.success) {
			toast.error(result.error.issues[0].message);
			return;
		}

		setIsSubmitting(true);
		try {
			const res = await apiFetch("/api/v1/users", {
				method: "POST",
				body: { name },
			});
			toast.success("User added!");
			onUserAdded(res); // Notify parent
			setName("");
			onClose(); // Close modal
		} catch (err) {
			if (err.message) {
				toast.error(err.message);
			} else {
				toast.error("Failed to add user");
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur">
			<div className="glass border border-white/40 rounded-2xl shadow-2xl p-8 w-full max-w-md text-gray-800">
				<h2 className="text-2xl font-semibold mb-6 text-black/80">
					Add New User
				</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					<input
						type="text"
						placeholder="Enter name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						className="w-full px-4 py-2 rounded-xl bg-white/70 border border-white/40 focus:outline-none focus:ring-2 focus:ring-blue-200"
					/>
					<div className="flex justify-end space-x-2">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-black font-medium cursor-pointer"
							disabled={isSubmitting}
						>
							Cancel
						</button>
						<button
							type="submit"
							className="px-4 py-2 glass text-black font-semibold rounded-xl hover:bg-white/50 transition border border-white/30 shadow cursor-pointer"
							disabled={isSubmitting}
						>
							{isSubmitting ? "Adding..." : "Add"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
