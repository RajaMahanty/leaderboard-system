import { useEffect, useState, Fragment, useRef } from "react";
import { Combobox } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/24/solid";
import { apiFetch } from "../api/client";
import ReactDOM from "react-dom";

function getInitials(name) {
	return name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();
}

export default function UserSelector({
	users: usersProp,
	selectedUser,
	onSelect,
}) {
	const [users, setUsers] = useState(usersProp || []);
	const [query, setQuery] = useState("");
	const inputRef = useRef(null);
	const [dropdownPos, setDropdownPos] = useState(null);

	useEffect(() => {
		if (!usersProp) {
			apiFetch("/api/v1/users").then(setUsers).catch(console.error);
		}
	}, [usersProp]);

	const filteredUsers =
		query === ""
			? users
			: users.filter((user) =>
					user.name.toLowerCase().includes(query.toLowerCase())
			  );

	// Calculate dropdown position when query changes and input is focused
	useEffect(() => {
		if (query.length > 0 && filteredUsers.length > 0 && inputRef.current) {
			const rect = inputRef.current.getBoundingClientRect();
			setDropdownPos({
				top: rect.bottom + window.scrollY,
				left: rect.left + window.scrollX,
				width: rect.width,
			});
		} else {
			setDropdownPos(null);
		}
	}, [query, filteredUsers.length]);

	return (
		<div className="w-full max-w-xs relative">
			<Combobox value={selectedUser} onChange={onSelect} nullable>
				<div className="relative">
					<Combobox.Input
						ref={inputRef}
						displayValue={(user) => (user ? user.name : "")}
						onChange={(e) => setQuery(e.target.value)}
						placeholder="Select user"
						className="glass w-full px-4 py-2 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-blue-200 shadow pr-10"
					/>
					<Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-3">
						<ChevronUpDownIcon
							className="h-5 w-5 text-gray-400"
							aria-hidden="true"
						/>
					</Combobox.Button>
					{query.length > 0 &&
						filteredUsers.length > 0 &&
						dropdownPos &&
						ReactDOM.createPortal(
							<Combobox.Options as={Fragment}>
								<div
									className="z-50 rounded-xl bg-white/90 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
									style={{
										position: "absolute",
										top: dropdownPos.top,
										left: dropdownPos.left,
										width: dropdownPos.width,
										maxHeight: "60vh",
										overflowY: "auto",
									}}
								>
									{filteredUsers.map((user) => (
										<Combobox.Option
											key={user._id}
											value={user}
											className={({ active }) =>
												`relative cursor-pointer select-none py-2 pl-10 pr-4 rounded-xl ${
													active ? "bg-blue-100 text-blue-900" : "text-black"
												}`
											}
										>
											<span className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center justify-center h-7 w-7 rounded-full bg-blue-200 text-blue-700 font-bold">
												{getInitials(user.name)}
											</span>
											<span
												className={`block truncate ml-10 ${
													selectedUser && user._id === selectedUser._id
														? "font-semibold"
														: "font-normal"
												}`}
											>
												{user.name}
											</span>
											{selectedUser && user._id === selectedUser._id ? (
												<span className="absolute inset-y-0 right-2 flex items-center pl-3 text-blue-600">
													<CheckIcon className="h-5 w-5" aria-hidden="true" />
												</span>
											) : null}
										</Combobox.Option>
									))}
								</div>
							</Combobox.Options>,
							document.body
						)}
				</div>
			</Combobox>
		</div>
	);
}
