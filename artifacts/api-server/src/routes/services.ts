import { Router, type IRouter } from "express";
import { ServiceModel } from "@workspace/db";
import {
  CreateServiceBody,
  UpdateServiceBody,
  ListServicesQueryParams,
  ListPublicServicesQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/services", async (req, res): Promise<void> => {
  const params = ListServicesQueryParams.safeParse(req.query);
  const filter: Record<string, unknown> = {};
  if (params.success) {
    if (params.data.published != null) {
      filter.published = params.data.published === "true";
    }
    if (params.data.category) {
      filter.category = params.data.category;
    }
  }
  const services = await ServiceModel.find(filter).sort({ sortOrder: 1, createdAt: 1 });
  res.json(services);
});

router.post("/services", async (req, res): Promise<void> => {
  const parsed = CreateServiceBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const service = await ServiceModel.create(parsed.data);
  res.status(201).json(service);
});

router.get("/services/featured", async (_req, res): Promise<void> => {
  const services = await ServiceModel.find({ featured: true, published: true }).sort({ sortOrder: 1 });
  res.json(services);
});

router.get("/services/public", async (req, res): Promise<void> => {
  const params = ListPublicServicesQueryParams.safeParse(req.query);
  const filter: Record<string, unknown> = { published: true };
  if (params.success && params.data.category) {
    filter.category = params.data.category;
  }
  const services = await ServiceModel.find(filter).sort({ sortOrder: 1 });
  res.json(services);
});

router.get("/services/:id", async (req, res): Promise<void> => {
  try {
    const service = await ServiceModel.findById(req.params.id);
    if (!service) {
      res.status(404).json({ error: "Service not found" });
      return;
    }
    res.json(service);
  } catch {
    res.status(404).json({ error: "Service not found" });
  }
});

router.patch("/services/:id", async (req, res): Promise<void> => {
  const parsed = UpdateServiceBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  try {
    const service = await ServiceModel.findByIdAndUpdate(req.params.id, parsed.data, { new: true });
    if (!service) {
      res.status(404).json({ error: "Service not found" });
      return;
    }
    res.json(service);
  } catch {
    res.status(404).json({ error: "Service not found" });
  }
});

router.delete("/services/:id", async (req, res): Promise<void> => {
  try {
    await ServiceModel.findByIdAndDelete(req.params.id);
  } catch { /* ignore invalid id */ }
  res.sendStatus(204);
});

export default router;
