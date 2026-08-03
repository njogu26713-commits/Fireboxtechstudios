import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, faqItemsTable, trustedClientsTable } from "@workspace/db";
import {
  CreateFaqItemBody,
  UpdateFaqItemBody,
  UpdateFaqItemParams,
  DeleteFaqItemParams,
  CreateTrustedClientBody,
  UpdateTrustedClientBody,
  UpdateTrustedClientParams,
  DeleteTrustedClientParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

// FAQ
router.get("/faq", async (_req, res): Promise<void> => {
  const items = await db.select().from(faqItemsTable).orderBy(faqItemsTable.sortOrder);
  res.json(items);
});

router.post("/faq", async (req, res): Promise<void> => {
  const parsed = CreateFaqItemBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [item] = await db.insert(faqItemsTable).values(parsed.data).returning();
  res.status(201).json(item);
});

router.patch("/faq/:id", async (req, res): Promise<void> => {
  const params = UpdateFaqItemParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateFaqItemBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [item] = await db
    .update(faqItemsTable)
    .set(parsed.data)
    .where(eq(faqItemsTable.id, params.data.id))
    .returning();
  if (!item) {
    res.status(404).json({ error: "FAQ item not found" });
    return;
  }
  res.json(item);
});

router.delete("/faq/:id", async (req, res): Promise<void> => {
  const params = DeleteFaqItemParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  await db.delete(faqItemsTable).where(eq(faqItemsTable.id, params.data.id));
  res.sendStatus(204);
});

// Trusted Clients
router.get("/clients", async (_req, res): Promise<void> => {
  const clients = await db.select().from(trustedClientsTable).orderBy(trustedClientsTable.sortOrder);
  res.json(clients);
});

router.post("/clients", async (req, res): Promise<void> => {
  const parsed = CreateTrustedClientBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [client] = await db.insert(trustedClientsTable).values(parsed.data).returning();
  res.status(201).json(client);
});

router.patch("/clients/:id", async (req, res): Promise<void> => {
  const params = UpdateTrustedClientParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateTrustedClientBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [client] = await db
    .update(trustedClientsTable)
    .set(parsed.data)
    .where(eq(trustedClientsTable.id, params.data.id))
    .returning();
  if (!client) {
    res.status(404).json({ error: "Client not found" });
    return;
  }
  res.json(client);
});

router.delete("/clients/:id", async (req, res): Promise<void> => {
  const params = DeleteTrustedClientParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  await db.delete(trustedClientsTable).where(eq(trustedClientsTable.id, params.data.id));
  res.sendStatus(204);
});

export default router;
