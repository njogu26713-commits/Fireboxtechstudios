import { Router, type IRouter } from "express";
import { FaqItemModel, TrustedClientModel } from "@workspace/db";
import {
  CreateFaqItemBody,
  UpdateFaqItemBody,
  CreateTrustedClientBody,
  UpdateTrustedClientBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

// ─── FAQ ──────────────────────────────────────────────────────────────────────

router.get("/faq", async (_req, res): Promise<void> => {
  const items = await FaqItemModel.find().sort({ sortOrder: 1 });
  res.json(items);
});

router.post("/faq", async (req, res): Promise<void> => {
  const parsed = CreateFaqItemBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const item = await FaqItemModel.create(parsed.data);
  res.status(201).json(item);
});

router.patch("/faq/:id", async (req, res): Promise<void> => {
  const parsed = UpdateFaqItemBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  try {
    const item = await FaqItemModel.findByIdAndUpdate(req.params.id, parsed.data, { new: true });
    if (!item) {
      res.status(404).json({ error: "FAQ item not found" });
      return;
    }
    res.json(item);
  } catch {
    res.status(404).json({ error: "FAQ item not found" });
  }
});

router.delete("/faq/:id", async (req, res): Promise<void> => {
  try {
    await FaqItemModel.findByIdAndDelete(req.params.id);
  } catch { /* ignore invalid id */ }
  res.sendStatus(204);
});

// ─── Trusted Clients ──────────────────────────────────────────────────────────

router.get("/clients", async (_req, res): Promise<void> => {
  const clients = await TrustedClientModel.find().sort({ sortOrder: 1 });
  res.json(clients);
});

router.post("/clients", async (req, res): Promise<void> => {
  const parsed = CreateTrustedClientBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const client = await TrustedClientModel.create(parsed.data);
  res.status(201).json(client);
});

router.patch("/clients/:id", async (req, res): Promise<void> => {
  const parsed = UpdateTrustedClientBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  try {
    const client = await TrustedClientModel.findByIdAndUpdate(req.params.id, parsed.data, { new: true });
    if (!client) {
      res.status(404).json({ error: "Client not found" });
      return;
    }
    res.json(client);
  } catch {
    res.status(404).json({ error: "Client not found" });
  }
});

router.delete("/clients/:id", async (req, res): Promise<void> => {
  try {
    await TrustedClientModel.findByIdAndDelete(req.params.id);
  } catch { /* ignore invalid id */ }
  res.sendStatus(204);
});

export default router;
