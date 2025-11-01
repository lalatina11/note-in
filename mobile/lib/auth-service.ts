import { getSession } from "./auth-client";

export const getSessionByToken = async (token: string) => await getSession({ fetchOptions: { headers: { accept: "application/json", authorization: `Bearer ${token}` } } })