import { Router, type IRouter } from "express";
import { SiteSettingsModel } from "@workspace/db";
import { UpdateSiteSettingsBody } from "@workspace/api-zod";

const router: IRouter = Router();

async function getOrCreateSettings() {
  let settings = await SiteSettingsModel.findOne();
  if (!settings) {
    settings = await SiteSettingsModel.create({});
  }
  return settings;
}

router.get("/settings", async (_req, res): Promise<void> => {
  const settings = await getOrCreateSettings();
  res.json(settings);
});

router.patch("/settings", async (req, res): Promise<void> => {
  const parsed = UpdateSiteSettingsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const settings = await getOrCreateSettings();
  const updated = await SiteSettingsModel.findByIdAndUpdate(settings._id, parsed.data, { new: true });
  res.json(updated);
});

export default router;
