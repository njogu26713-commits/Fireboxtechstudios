import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, quoteRequestsTable } from "@workspace/db";
import {
  CreateQuoteRequestBody,
  UpdateQuoteRequestBody,
  UpdateQuoteRequestParams,
  DeleteQuoteRequestParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/quotes", async (_req, res): Promise<void> => {
  const quotes = await db
    .select()
    .from(quoteRequestsTable)
    .orderBy(quoteRequestsTable.createdAt);
  res.json(quotes);
});

router.post("/quotes", async (req, res): Promise<void> => {
  const parsed = CreateQuoteRequestBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [quote] = await db.insert(quoteRequestsTable).values(parsed.data).returning();
  res.status(201).json(quote);
});

router.patch("/quotes/:id", async (req, res): Promise<void> => {
  const params = UpdateQuoteRequestParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateQuoteRequestBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [quote] = await db
    .update(quoteRequestsTable)
    .set(parsed.data)
    .where(eq(quoteRequestsTable.id, params.data.id))
    .returning();
  if (!quote) {
    res.status(404).json({ error: "Quote request not found" });
    return;
  }
  res.json(quote);
});

router.delete("/quotes/:id", async (req, res): Promise<void> => {
  const params = DeleteQuoteRequestParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  await db.delete(quoteRequestsTable).where(eq(quoteRequestsTable.id, params.data.id));
  res.sendStatus(204);
});

export default router;
