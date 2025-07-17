const BASE_URL = (
	import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

export async function apiFetch(endpoint, config = {}) {
	try {
		const headers = {
			"Content-Type": "application/json",
			...(config.headers || {}),
		};
		let body = config.body;
		if (body && typeof body === "object") {
			body = JSON.stringify(body);
		}
		const res = await fetch(BASE_URL + endpoint, {
			headers,
			...config,
			body,
		});

		const json = await res.json().catch(() => null);

		if (!res.ok) {
			const errMsg = json?.error || json?.message || res.statusText;
			const err = new Error(errMsg);
			err.status = res.status;
			throw err;
		}

		return json;
	} catch (err) {
		console.error("Fetch error:", err);
		throw err;
	}
}
