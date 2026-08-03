import { Router, type IRouter } from "express";
import { JobModel } from "@workspace/db";
import { CreateJobBody, UpdateJobBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/jobs", async (_req, res): Promise<void> => {
  const jobs = await JobModel.find().sort({ createdAt: -1 });
  res.json(jobs);
});

router.post("/jobs", async (req, res): Promise<void> => {
  const parsed = CreateJobBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const job = await JobModel.create(parsed.data);
  res.status(201).json(job);
});

router.get("/jobs/public", async (_req, res): Promise<void> => {
  const jobs = await JobModel.find({ active: true }).sort({ createdAt: -1 });
  res.json(jobs);
});

router.patch("/jobs/:id", async (req, res): Promise<void> => {
  const parsed = UpdateJobBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  try {
    const job = await JobModel.findByIdAndUpdate(req.params.id, parsed.data, { new: true });
    if (!job) {
      res.status(404).json({ error: "Job not found" });
      return;
    }
    res.json(job);
  } catch {
    res.status(404).json({ error: "Job not found" });
  }
});

router.delete("/jobs/:id", async (req, res): Promise<void> => {
  try {
    await JobModel.findByIdAndDelete(req.params.id);
  } catch { /* ignore invalid id */ }
  res.sendStatus(204);
});

export default router;
