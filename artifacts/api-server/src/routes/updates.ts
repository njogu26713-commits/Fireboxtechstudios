import { Router, type IRouter } from "express";
import { UpdateModel } from "@workspace/db";
import { z } from "zod";

const router: IRouter = Router();

const CreateUpdateBody = z.object({
  title: z.string().optional().nullable(),
  caption: z.string().min(1),
  mediaType: z.enum(["video", "photo", "text"]),
  mediaUrl: z.string().optional().nullable(),
  thumbnail: z.string().optional().nullable(),
  published: z.boolean().optional(),
  pinned: z.boolean().optional(),
});

const UpdateUpdateBody = CreateUpdateBody.partial();

// Admin: list all updates
router.get("/updates", async (_req, res): Promise<void> => {
  const items = await UpdateModel.find().sort({ pinned: -1, createdAt: -1 });
  res.json(items);
});

// Public: list published updates
router.get("/updates/public", async (_req, res): Promise<void> => {
  const items = await UpdateModel.find({ published: true }).sort({ pinned: -1, createdAt: -1 });
  res.json(items);
});

// Create
router.post("/updates", async (req, res): Promise<void> => {
  const parsed = CreateUpdateBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const item = await UpdateModel.create(parsed.data);
  res.status(201).json(item);
});

// Get single
router.get("/updates/:id", async (req, res): Promise<void> => {
  try {
    const item = await UpdateModel.findById(req.params.id);
    if (!item) { res.status(404).json({ error: "Update not found" }); return; }
    res.json(item);
  } catch {
    res.status(404).json({ error: "Update not found" });
  }
});

// Update
router.patch("/updates/:id", async (req, res): Promise<void> => {
  const parsed = UpdateUpdateBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  try {
    const item = await UpdateModel.findByIdAndUpdate(req.params.id, parsed.data, { new: true });
    if (!item) { res.status(404).json({ error: "Update not found" }); return; }
    res.json(item);
  } catch {
    res.status(404).json({ error: "Update not found" });
  }
});

// Delete
router.delete("/updates/:id", async (req, res): Promise<void> => {
  try {
    await UpdateModel.findByIdAndDelete(req.params.id);
  } catch { /* ignore */ }
  res.sendStatus(204);
});

export default router;
