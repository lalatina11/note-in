import { z } from "zod";

export const registerSchema = z.object({
    name: z.string("username are required").min(3, "username minimal 3 characters").max(32, "username maximum 32 characters").lowercase(),
    email: z.email("invalid email"),
    password: z.string("password are required").min(8, "password minimal 8 characters").max(32, "username maximum 32 characters")
})

export const noteSchema = z.object({
    title: z.string().min(3, "note title minimal 3 characters").max(64, "note title maximum 64 characters"),
    description: z.string("note description are required!")
})