import z from "zod";
import { createPostSchema } from "../lib/schema/postSchema";
import db from "../db";
import { note as noteTable } from "../db/schema";
import { uuidGenerator } from "../lib";
import { and, desc, eq } from "drizzle-orm";

export type createPostSchemaBody = z.infer<typeof createPostSchema>

export const noteServices = {
    create: async (userId: string, body: createPostSchemaBody) => {
        const id = uuidGenerator()
        const [result] = await db.insert(noteTable).values({ ...body, id, userId }).returning()
        return result
    },
    getAll: async (userId: string) => {
        return await db.select().from(noteTable).where(eq(noteTable.userId, userId)).orderBy(desc(noteTable.createdAt))
    },
    getById: async (id: string, userId: string) => {
        const [note] = await db.select().from(noteTable).where(and(eq(noteTable.id, id), eq(noteTable.userId, userId)))
        return note
    },
    update: async (id: string, body: createPostSchemaBody) => {
        const [updatedNote] = await db.update(noteTable).set({ ...body }).where(eq(noteTable.id, id)).returning()
        return updatedNote
    },
    delete: async (id: string) => {
        await db.delete(noteTable).where(eq(noteTable.id, id))
    }
}