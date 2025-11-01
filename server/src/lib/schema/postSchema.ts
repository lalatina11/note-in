import z from "zod";

export const createPostSchema = z.object({
    title: z.string().min(3).max(64),
    description: z.string()
})