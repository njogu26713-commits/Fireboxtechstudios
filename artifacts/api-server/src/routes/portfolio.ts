import { Router, type IRouter } from "express";
import { ProjectModel } from "@workspace/db";
import {
  CreateProjectBody,
  UpdateProjectBody,
  ListPublicProjectsQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/portfolio", async (_req, res): Promise<void> => {
  const projects = await ProjectModel.find().sort({ createdAt: -1 });
  res.json(projects);
});

router.post("/portfolio", async (req, res): Promise<void> => {
  const parsed = CreateProjectBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const project = await ProjectModel.create(parsed.data);
  res.status(201).json(project);
});

router.get("/portfolio/featured", async (_req, res): Promise<void> => {
  const projects = await ProjectModel.find({ featured: true, published: true }).sort({ createdAt: -1 });
  res.json(projects);
});

router.get("/portfolio/public", async (req, res): Promise<void> => {
  const params = ListPublicProjectsQueryParams.safeParse(req.query);
  const filter: Record<string, unknown> = { published: true };
  let projects = await ProjectModel.find(filter).sort({ createdAt: -1 });
  if (params.success && params.data.technology) {
    projects = projects.filter((p) => p.technologies?.includes(params.data.technology!));
  }
  res.json(projects);
});

router.get("/portfolio/:id", async (req, res): Promise<void> => {
  try {
    const project = await ProjectModel.findById(req.params.id);
    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }
    res.json(project);
  } catch {
    res.status(404).json({ error: "Project not found" });
  }
});

router.patch("/portfolio/:id", async (req, res): Promise<void> => {
  const parsed = UpdateProjectBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  try {
    const project = await ProjectModel.findByIdAndUpdate(req.params.id, parsed.data, { new: true });
    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }
    res.json(project);
  } catch {
    res.status(404).json({ error: "Project not found" });
  }
});

router.delete("/portfolio/:id", async (req, res): Promise<void> => {
  try {
    await ProjectModel.findByIdAndDelete(req.params.id);
  } catch { /* ignore invalid id */ }
  res.sendStatus(204);
});

export default router;
