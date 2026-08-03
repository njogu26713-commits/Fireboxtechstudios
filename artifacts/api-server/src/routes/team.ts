import { Router, type IRouter } from "express";
import { TeamMemberModel } from "@workspace/db";
import {
  CreateTeamMemberBody,
  UpdateTeamMemberBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/team", async (_req, res): Promise<void> => {
  const members = await TeamMemberModel.find().sort({ sortOrder: 1 });
  res.json(members);
});

router.post("/team", async (req, res): Promise<void> => {
  const parsed = CreateTeamMemberBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const member = await TeamMemberModel.create(parsed.data);
  res.status(201).json(member);
});

router.patch("/team/:id", async (req, res): Promise<void> => {
  const parsed = UpdateTeamMemberBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  try {
    const member = await TeamMemberModel.findByIdAndUpdate(req.params.id, parsed.data, { new: true });
    if (!member) {
      res.status(404).json({ error: "Team member not found" });
      return;
    }
    res.json(member);
  } catch {
    res.status(404).json({ error: "Team member not found" });
  }
});

router.delete("/team/:id", async (req, res): Promise<void> => {
  try {
    await TeamMemberModel.findByIdAndDelete(req.params.id);
  } catch { /* ignore invalid id */ }
  res.sendStatus(204);
});

export default router;
