import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, contactMessagesTable } from "@workspace/db";
import {
  CreateContactMessageBody,
  DeleteContactMessageParams,
  UpdateContactMessageParams,
  UpdateContactMessageBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/contact", async (_req, res): Promise<void> => {
  const messages = await db
    .select()
    .from(contactMessagesTable)
    .orderBy(contactMessagesTable.createdAt);
  res.json(messages);
});

router.post("/contact", async (req, res): Promise<void> => {
  const parsed = CreateContactMessageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [message] = await db.insert(contactMessagesTable).values(parsed.data).returning();
  res.status(201).json(message);
});

router.patch("/contact/:id", async (req, res): Promise<void> => {
  const params = UpdateContactMessageParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateContactMessageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [message] = await db
    .update(contactMessagesTable)
    .set(parsed.data)
    .where(eq(contactMessagesTable.id, params.data.id))
    .returning();
  if (!message) {
    res.status(404).json({ error: "Message not found" });
    return;
  }
  res.json(message);
});

router.delete("/contact/:id", async (req, res): Promise<void> => {
  const params = DeleteContactMessageParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  await db.delete(contactMessagesTable).where(eq(contactMessagesTable.id, params.data.id));
  res.sendStatus(204);
});

export default router;
