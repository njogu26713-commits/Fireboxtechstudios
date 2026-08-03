import { Router, type IRouter } from "express";
import { TutorialModel } from "@workspace/db";
import {
  CreateTutorialBody,
  UpdateTutorialBody,
  ListTutorialsQueryParams,
  ListPublicTutorialsQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/tutorials", async (req, res): Promise<void> => {
  const params = ListTutorialsQueryParams.safeParse(req.query);
  let tutorials = await TutorialModel.find().sort({ createdAt: -1 });
  if (params.success) {
    if (params.data.published != null) {
      const pub = params.data.published === "true";
      tutorials = tutorials.filter((t) => t.published === pub);
    }
    if (params.data.category) {
      tutorials = tutorials.filter((t) => t.category === params.data.category);
    }
    if (params.data.search) {
      const q = params.data.search.toLowerCase();
      tutorials = tutorials.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q),
      );
    }
  }
  res.json(tutorials);
});

router.post("/tutorials", async (req, res): Promise<void> => {
  const parsed = CreateTutorialBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const tutorial = await TutorialModel.create(parsed.data);
  res.status(201).json(tutorial);
});

router.get("/tutorials/public", async (req, res): Promise<void> => {
  const params = ListPublicTutorialsQueryParams.safeParse(req.query);
  let tutorials = await TutorialModel.find({ published: true }).sort({ createdAt: -1 });
  if (params.success) {
    if (params.data.category) {
      tutorials = tutorials.filter((t) => t.category === params.data.category);
    }
    if (params.data.search) {
      const q = params.data.search.toLowerCase();
      tutorials = tutorials.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q),
      );
    }
  }
  res.json(tutorials);
});

router.get("/tutorials/:id", async (req, res): Promise<void> => {
  try {
    const tutorial = await TutorialModel.findById(req.params.id);
    if (!tutorial) {
      res.status(404).json({ error: "Tutorial not found" });
      return;
    }
    res.json(tutorial);
  } catch {
    res.status(404).json({ error: "Tutorial not found" });
  }
});

router.patch("/tutorials/:id", async (req, res): Promise<void> => {
  const parsed = UpdateTutorialBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  try {
    const tutorial = await TutorialModel.findByIdAndUpdate(req.params.id, parsed.data, { new: true });
    if (!tutorial) {
      res.status(404).json({ error: "Tutorial not found" });
      return;
    }
    res.json(tutorial);
  } catch {
    res.status(404).json({ error: "Tutorial not found" });
  }
});

router.delete("/tutorials/:id", async (req, res): Promise<void> => {
  try {
    await TutorialModel.findByIdAndDelete(req.params.id);
  } catch { /* ignore invalid id */ }
  res.sendStatus(204);
});

export default router;
