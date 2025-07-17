import { z } from "zod";

export const createUserSchema = z.object({
	name: z.string().min(1, "Name is required"),
});

export const claimPointsSchema = z.object({
	userId: z.string().min(1, "User ID is required"),
});
