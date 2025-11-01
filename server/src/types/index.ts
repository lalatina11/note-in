import { auth } from "../lib/auth";
export type SessionData = Awaited<ReturnType<typeof auth.api.getSession>>
