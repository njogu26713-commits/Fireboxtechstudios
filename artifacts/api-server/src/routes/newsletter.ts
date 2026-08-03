import { Router, type IRouter } from "express";
import { db, newsletterSubscriptionsTable } from "@workspace/db";
import { SubscribeNewsletterBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/newsletter", async (req, res): Promise<void> => {
  const parsed = SubscribeNewsletterBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  try {
    const [sub] = await db.insert(newsletterSubscriptionsTable).values(parsed.data).returning();
    res.status(201).json(sub);
  } catch {
    res.status(409).json({ error: "Email already subscribed" });
  }
});

router.get("/newsletter", async (_req, res): Promise<void> => {
  const subs = await db.select().from(newsletterSubscriptionsTable).orderBy(newsletterSubscriptionsTable.createdAt);
  res.json(subs);
});

export default router;
