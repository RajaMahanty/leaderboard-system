const errorHandler = (err, req, res, next) => {
	console.error(err.stack);

	// Handle MongoDB duplicate key error
	if (err.code === 11000 && err.keyPattern && err.keyPattern.name) {
		return res.status(400).json({
			success: false,
			message:
				"A user with that name already exists. Please choose a different name.",
		});
	}

	const statusCode = err.statusCode || 500;
	res.status(statusCode).json({
		success: false,
		message: err.message || "Internal Server Error",
	});
};

export default errorHandler;
