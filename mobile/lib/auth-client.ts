import { createAuthClient } from "better-auth/react"
import ENV from "./env"
export const { signIn, signOut, signUp, getSession } = createAuthClient({
    baseURL: ENV.EXPO_PUBLIC_API_BASE_URL
})