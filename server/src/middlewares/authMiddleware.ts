import { createMiddleware } from "hono/factory"
import { getSession } from "../services/auth-services"
import type { SessionData } from "../types"


export const authMiddleware = createMiddleware<{ Variables: { session: SessionData } }>(async (c, next) => {
    try {
        const session = await getSession(c.req.raw.headers)
        if (!session) {
            c.set('session', null)
            return await next()
        }
        c.set('session', session)
        await next()
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Authentication failed'
        return c.json({ error: true, message }, 401)
    }
})