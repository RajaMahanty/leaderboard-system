import { useEffect, useState, useRef } from "react";
import "./App.css";
import { apiFetch } from "./api/client";
import Leaderboard from "./components/Leaderboard";
import ClaimButton from "./components/ClaimButton";
import ClaimHistory from "./components/ClaimHistory";
import AddUserModal from "./components/AddUserModal";
import UserSelector from "./components/UserSelector";
import { Toaster, toast } from "react-hot-toast";

function App() {
	const [users, setUsers] = useState([]);
	const [selectedUser, setSelectedUser] = useState(null);
	const [isModalOpen, setModalOpen] = useState(false);
	const [isHistoryOpen, setHistoryOpen] = useState(false);
	const leaderboardRef = useRef();

	// Fetch users on load
	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const res = await apiFetch("/api/v1/users");
				setUsers(res.data);
			} catch (err) {
				toast.error("Failed to load users", err);
			}
		};
		fetchUsers();
	}, []);

	const handleUserAdded = (newUser) => {
		console.log("[handleUserAdded] newUser:", newUser);
		if (newUser && typeof newUser === "object" && !Array.isArray(newUser)) {
			setUsers((prev) =>
				Array.isArray(prev) ? [...prev, newUser] : [newUser]
			);
			setSelectedUser(newUser);
			leaderboardRef.current?.refreshLeaderboard();
		} else {
			toast.error("Failed to add user: invalid user object");
		}
	};

	const handleClaimSuccess = (data) => {
		if (data && data.points && data.user && data.user.name) {
			toast.success(`+${data.points} pts for ${data.user.name}`);
		} else {
			toast.success("Points claimed!");
		}
		leaderboardRef.current?.refreshLeaderboard();
	};

	return (
		<main className="h-screen w-screen bg-gradient-to-br from-white/80 to-blue-100 text-black flex flex-col overflow-hidden">
			<Toaster position="top-right" />
			{/* Header */}
			<header className="flex flex-wrap justify-between items-center px-4 sm:px-8 py-3 sm:py-4 shadow bg-white/60 backdrop-blur z-10 gap-2">
				<h1 className="flex items-center text-2xl sm:text-3xl font-extrabold text-black/80 tracking-tight drop-shadow-sm gap-2">
					<span className="text-xl sm:text-2xl">🏆</span>
					<span>Leaderboard</span>
				</h1>
				<div className="flex gap-2 flex-wrap">
					<button
						onClick={() => setHistoryOpen(true)}
						className="px-4 py-2 glass text-black font-semibold rounded-xl hover:bg-blue-100 transition-colors border border-white/30 shadow text-sm sm:text-base cursor-pointer"
					>
						Claim History
					</button>
					<button
						onClick={() => setModalOpen(true)}
						className="px-4 py-2 glass text-black font-semibold rounded-xl hover:bg-blue-100 transition-colors border border-white/30 shadow text-sm sm:text-base cursor-pointer"
					>
						+ Add User
					</button>
				</div>
			</header>

			{/* Dashboard Layout */}
			<div className="flex flex-col md:flex-row flex-1 min-h-0 min-w-0 overflow-hidden">
				{/* Sidebar */}
				<aside className="w-full md:max-w-xs bg-white/40 backdrop-blur-lg flex flex-col gap-6 p-4 md:p-6 glass rounded-none border-b md:border-b-0 md:border-r border-white/30 shadow md:h-full min-h-0">
					<UserSelector
						users={users}
						selectedUser={selectedUser}
						onSelect={setSelectedUser}
					/>
					<ClaimButton
						userId={selectedUser?._id}
						onSuccess={handleClaimSuccess}
					/>
				</aside>

				{/* Main Content */}
				<section className="flex-1 flex justify-center items-center overflow-hidden w-full h-full">
					<div className="w-full h-full flex flex-col justify-center items-center">
						<Leaderboard ref={leaderboardRef} />
					</div>
				</section>
			</div>

			{/* Add User Modal */}
			<AddUserModal
				isOpen={isModalOpen}
				onClose={() => setModalOpen(false)}
				onUserAdded={handleUserAdded}
			/>

			{/* ClaimHistory Modal */}
			<ClaimHistory
				isOpen={isHistoryOpen}
				onClose={() => setHistoryOpen(false)}
			/>
		</main>
	);
}

export default App;
