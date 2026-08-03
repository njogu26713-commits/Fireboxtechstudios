import { Router, type IRouter } from "express";
import { QuoteRequestModel } from "@workspace/db";
import {
  CreateQuoteRequestBody,
  UpdateQuoteRequestBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/quotes", async (_req, res): Promise<void> => {
  const quotes = await QuoteRequestModel.find().sort({ createdAt: 1 });
  res.json(quotes);
});

router.post("/quotes", async (req, res): Promise<void> => {
  const parsed = CreateQuoteRequestBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const quote = await QuoteRequestModel.create(parsed.data);
  res.status(201).json(quote);
});

router.patch("/quotes/:id", async (req, res): Promise<void> => {
  const parsed = UpdateQuoteRequestBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  try {
    const quote = await QuoteRequestModel.findByIdAndUpdate(req.params.id, parsed.data, { new: true });
    if (!quote) {
      res.status(404).json({ error: "Quote request not found" });
      return;
    }
    res.json(quote);
  } catch {
    res.status(404).json({ error: "Quote request not found" });
  }
});

router.delete("/quotes/:id", async (req, res): Promise<void> => {
  try {
    await QuoteRequestModel.findByIdAndDelete(req.params.id);
  } catch { /* ignore invalid id */ }
  res.sendStatus(204);
});

export default router;
