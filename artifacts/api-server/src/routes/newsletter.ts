import { Router, type IRouter } from "express";
import { NewsletterSubscriptionModel } from "@workspace/db";
import { SubscribeNewsletterBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/newsletter", async (req, res): Promise<void> => {
  const parsed = SubscribeNewsletterBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  try {
    const sub = await NewsletterSubscriptionModel.create(parsed.data);
    res.status(201).json(sub);
  } catch (err: unknown) {
    const e = err as { code?: number };
    if (e.code === 11000) {
      res.status(409).json({ error: "Email already subscribed" });
    } else {
      throw err;
    }
  }
});

router.get("/newsletter", async (_req, res): Promise<void> => {
  const subs = await NewsletterSubscriptionModel.find().sort({ createdAt: 1 });
  res.json(subs);
});

export default router;
