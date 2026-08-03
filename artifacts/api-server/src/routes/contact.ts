import { Router, type IRouter } from "express";
import { ContactMessageModel } from "@workspace/db";
import {
  CreateContactMessageBody,
  UpdateContactMessageBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/contact", async (_req, res): Promise<void> => {
  const messages = await ContactMessageModel.find().sort({ createdAt: 1 });
  res.json(messages);
});

router.post("/contact", async (req, res): Promise<void> => {
  const parsed = CreateContactMessageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const message = await ContactMessageModel.create(parsed.data);
  res.status(201).json(message);
});

router.patch("/contact/:id", async (req, res): Promise<void> => {
  const parsed = UpdateContactMessageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  try {
    const message = await ContactMessageModel.findByIdAndUpdate(req.params.id, parsed.data, { new: true });
    if (!message) {
      res.status(404).json({ error: "Message not found" });
      return;
    }
    res.json(message);
  } catch {
    res.status(404).json({ error: "Message not found" });
  }
});

router.delete("/contact/:id", async (req, res): Promise<void> => {
  try {
    await ContactMessageModel.findByIdAndDelete(req.params.id);
  } catch { /* ignore invalid id */ }
  res.sendStatus(204);
});

export default router;
