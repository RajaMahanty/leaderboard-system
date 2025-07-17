export default function validate(schema) {
	return (req, res, next) => {
		const result = schema.safeParse(req.body);
		if (!result.success) {
			return res.status(400).json({
				error: result.error.errors.map((e) => e.message).join(", "),
			});
		}
		req.validatedData = result.data;
		next();
	};
}
