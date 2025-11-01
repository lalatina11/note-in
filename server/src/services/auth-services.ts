import { auth } from "../lib/auth";

export const getSession = async (headers: Headers) => await auth.api.getSession({ headers }) 