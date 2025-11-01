import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { cors } from "hono/cors";
import { logger } from 'hono/logger';
import { auth } from './lib/auth';
import { createPostSchema } from './lib/schema/postSchema';
import { authMiddleware } from './middlewares/authMiddleware';
import { noteServices } from './services/note-services';

const app = new Hono()

app.use(logger())

app.use(
  "/api/auth/*", // or replace with "*" to enable cors for all routes
  cors({
    origin: "*", // replace with your origin
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);

app.get('/', (c) => {
  return c.json({ message: "hei it is '/'" })
})

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));


app.get('/api/v2/auth/me', async (c) => {
  try {
    const session = await auth.api.getSession({ headers: c.req.raw.headers })
    return c.json(session, { status: 200 })
  } catch (error) {
    const { message } = error as Error
    return c.json({ message, error: true }, { status: 401 })
  }
})

app.post('/api/notes', authMiddleware, zValidator("json", createPostSchema), async (c) => {
  try {
    const userId = c.get('session')?.user.id
    if (!userId) throw new Error("Not Authorized!")
    const body = c.req.valid("json")
    const note = await noteServices.create(userId, body)
    return c.json({ error: false, message: "created", data: note }, { status: 201 })
  } catch (error) {
    const { message } = error as Error
    return c.json({ error: true, message }, { status: 500 })

  }
})

app.get('/api/notes', authMiddleware, async (c) => {
  try {
    const userId = c.get('session')?.user.id
    if (!userId) throw new Error("Not Authorized!")
    const notes = await noteServices.getAll(userId)
    return c.json({ error: false, message: "success", data: notes }, { status: 201 })
  } catch (error) {
    const { message } = error as Error
    return c.json({ error: true, message }, { status: 500 })
  }
})

app.get('/api/notes/:id', authMiddleware, async (c) => {
  try {
    const userId = c.get('session')?.user.id
    if (!userId) throw new Error("Not Authorized!")
    const id = c.req.param("id")
    const note = await noteServices.getById(id, userId)
    if (!note) throw new Error("Cannot Found that note!")
    return c.json({ error: false, message: "success", data: note }, { status: 201 })
  } catch (error) {
    const { message } = error as Error
    return c.json({ error: true, message }, { status: 500 })
  }
})

app.patch('/api/notes/:id', authMiddleware, zValidator("json", createPostSchema), async (c) => {
  try {
    const id = c.req.param("id")
    const userId = c.get('session')?.user.id
    if (!userId) throw new Error("Not Authorized!")
    const note = await noteServices.getById(id, userId)
    if (!note) throw new Error("Cannot Found that note!")
    const body = c.req.valid("json")
    const updatedNote = await noteServices.update(note.id, body)
    return c.json({ error: false, message: "success", data: updatedNote }, { status: 201 })
  } catch (error) {
    const { message } = error as Error
    return c.json({ error: true, message }, { status: 500 })
  }
})

app.delete('/api/notes/:id', authMiddleware, async (c) => {
  try {
    const userId = c.get('session')?.user.id
    if (!userId) throw new Error("Not Authorized!")
    const id = c.req.param("id")
    const note = await noteServices.getById(id, userId)
    if (!note) throw new Error("Cannot Found that note!")
    await noteServices.delete(note.id)
    return c.json({ error: false, message: "success", }, { status: 201 })
  } catch (error) {
    const { message } = error as Error
    return c.json({ error: true, message }, { status: 500 })
  }
})

export default app
