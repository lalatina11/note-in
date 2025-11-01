import { betterAuth } from "better-auth"
export const auth = betterAuth({})

export type SessionData = Awaited<ReturnType<typeof auth.api.getSession>>

export type ApiResponse<T> = {
    error: boolean,
    message: string
    data?: T
}

export type Note = {
    id: string;
    title: string;
    description: string | null;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
};