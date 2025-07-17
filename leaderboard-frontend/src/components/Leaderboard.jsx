import {
	useEffect,
	useState,
	useRef,
	forwardRef,
	useImperativeHandle,
} from "react";
import { apiFetch } from "../api/client";
import io from "socket.io-client";

const socket = io("http://localhost:5000");
const PAGE_SIZE = 10;

const Leaderboard = forwardRef(function Leaderboard(props, ref) {
	const [leaders, setLeaders] = useState([]);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const listRef = useRef(null);

	const fetchLeaderboard = async (targetPage = page) => {
		setLoading(true);
		try {
			const data = await apiFetch(
				`/api/v1/leaderboard?page=${targetPage}&limit=${PAGE_SIZE}`
			);
			setLeaders(data.leaderboard);
			setTotalPages(data.totalPages);
			setPage(data.page);
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	useImperativeHandle(ref, () => ({
		refreshLeaderboard: () => fetchLeaderboard(page),
	}));

	useEffect(() => {
		fetchLeaderboard(1);
		socket.on("leaderboard:update", () => fetchLeaderboard(page));
		return () => socket.off("leaderboard:update", () => fetchLeaderboard(page));
		// eslint-disable-next-line
	}, []);

	const handlePageChange = (newPage) => {
		if (newPage >= 1 && newPage <= totalPages) {
			fetchLeaderboard(newPage);
		}
	};

	return (
		<div className="glass w-full h-full p-2 sm:p-4 md:p-6 shadow flex flex-col gap-2 rounded-lg sm:rounded-2xl max-w-full mt-2 sm:mt-0">
			<h2 className="text-2xl sm:text-3xl font-extrabold mb-4 text-black/90 text-center tracking-tight">
				Leaderboard
			</h2>
			<ul
				ref={listRef}
				className="space-y-3 w-full h-full overflow-y-auto pr-2"
			>
				{leaders.map((user) => {
					let rankStyle = "";
					let medal = null;
					if (user.rank === 1) {
						rankStyle = "text-yellow-500 font-extrabold";
						medal = (
							<span className="mr-2" title="1st Place">
								🥇
							</span>
						);
					} else if (user.rank === 2) {
						rankStyle = "text-gray-400 font-bold";
						medal = (
							<span className="mr-2" title="2nd Place">
								🥈
							</span>
						);
					} else if (user.rank === 3) {
						rankStyle = "text-orange-500 font-bold";
						medal = (
							<span className="mr-2" title="3rd Place">
								🥉
							</span>
						);
					}
					return (
						<li
							key={user.name}
							className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2 px-2 rounded-xl hover:bg-white/20 transition"
						>
							<div className="flex items-baseline gap-2">
								<span
									className={`font-bold text-lg sm:text-xl text-blue-700 ${rankStyle}`}
								>
									#{user.rank}
								</span>
								{medal}
								<span className="font-semibold text-base sm:text-lg text-black/90">
									{user.name}
								</span>
							</div>
							<span className="font-mono text-sm sm:text-base text-gray-700 mt-1 sm:mt-0">
								{user.totalPoints} pts
							</span>
						</li>
					);
				})}
				{loading && (
					<li className="text-center text-xs text-black/50 py-2">Loading...</li>
				)}
			</ul>
			{/* Pagination Controls */}
			<div className="flex flex-row justify-center items-center gap-2 sm:gap-4 mt-4 w-full">
				<button
					disabled={page === 1}
					onClick={() => handlePageChange(page - 1)}
					className="px-3 py-1 rounded bg-blue-100 text-blue-700 font-semibold disabled:opacity-50 cursor-pointer hover:bg-blue-200 transition-colors"
				>
					Prev
				</button>
				<span className="text-black/70 text-sm sm:text-base align-middle">
					Page {page} of {totalPages}
				</span>
				<button
					disabled={page === totalPages}
					onClick={() => handlePageChange(page + 1)}
					className="px-3 py-1 rounded bg-blue-100 text-blue-700 font-semibold disabled:opacity-50 cursor-pointer hover:bg-blue-200 transition-colors"
				>
					Next
				</button>
			</div>
		</div>
	);
});

export default Leaderboard;
