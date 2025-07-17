import { useEffect, useState, useRef } from "react";
import { apiFetch } from "../api/client";

export default function ClaimHistory({ isOpen, onClose }) {
	const [history, setHistory] = useState([]);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [loading, setLoading] = useState(false);
	const listRef = useRef(null);

	const loadMore = async () => {
		if (loading || !hasMore) return;
		setLoading(true);
		try {
			const data = await apiFetch(`/api/v1/claim/history?page=${page}`);
			setHistory((prev) => [...prev, ...data.claims]);
			setPage((p) => p + 1);
			if (data.claims.length === 0) setHasMore(false);
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	// Helper to check if the list is scrollable
	const isListScrollable = () => {
		const el = listRef.current;
		if (!el) return false;
		return el.scrollHeight > el.clientHeight + 2; // +2 for rounding
	};

	// On open, load and keep loading until scrollable or no more data
	useEffect(() => {
		let cancelled = false;
		async function ensureScrollable() {
			if (!isOpen) return;
			setHistory([]);
			setPage(1);
			setHasMore(true);
			setLoading(false);
			await new Promise((r) => setTimeout(r, 0));
			let keepLoading = true;
			let nextPage = 1;
			let allHistory = [];
			while (keepLoading && !cancelled) {
				setLoading(true);
				try {
					const data = await apiFetch(`/api/v1/claim/history?page=${nextPage}`);
					allHistory = [...allHistory, ...data.claims];
					setHistory([...allHistory]);
					setPage(nextPage + 1);
					if (data.claims.length === 0) {
						setHasMore(false);
						keepLoading = false;
					} else {
						setHasMore(true);
						await new Promise((r) => setTimeout(r, 0));
						if (listRef.current && isListScrollable()) {
							keepLoading = false;
						} else {
							nextPage++;
						}
					}
				} catch (err) {
					console.error(err);
					keepLoading = false;
				} finally {
					setLoading(false);
				}
			}
		}
		if (isOpen) ensureScrollable();
		return () => {
			cancelled = true;
		};
	}, [isOpen]);

	const handleScroll = (e) => {
		const el = e.target;
		if (
			el.scrollHeight - el.scrollTop - el.clientHeight < 60 &&
			hasMore &&
			!loading
		) {
			loadMore();
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur">
			<div className="glass p-8 rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col gap-4 relative">
				<button
					onClick={onClose}
					className="absolute top-4 right-4 text-black/60 hover:text-black text-2xl font-bold focus:outline-none cursor-pointer"
					aria-label="Close"
				>
					&times;
				</button>
				<h2 className="text-2xl font-bold mb-2 text-black/80 text-center">
					Claim History
				</h2>
				<ul
					ref={listRef}
					onScroll={handleScroll}
					className="space-y-2 max-h-[50vh] overflow-y-auto pr-2"
				>
					{history.map((entry, i) => (
						<li
							key={i}
							className="flex justify-between items-center text-sm py-2 px-2 rounded-xl hover:bg-white/20 transition"
						>
							<span className="font-medium">{entry.user.name}</span>
							<span className="font-mono">+{entry.points} pts</span>
							<span className="text-xs text-black/60">
								{new Date(entry.createdAt).toLocaleString()}
							</span>
						</li>
					))}
					{loading && (
						<li className="text-center text-xs text-black/50 py-2">
							Loading...
						</li>
					)}
					{!hasMore && !loading && history.length > 0 && (
						<li className="text-center text-xs text-black/40 py-2">
							No more history
						</li>
					)}
				</ul>
			</div>
		</div>
	);
}
