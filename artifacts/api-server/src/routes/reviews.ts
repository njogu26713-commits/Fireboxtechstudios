import { Router, type IRouter } from "express";
import { ReviewModel } from "@workspace/db";
import {
  CreateReviewBody,
  UpdateReviewBody,
  ListReviewsQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/reviews", async (req, res): Promise<void> => {
  const params = ListReviewsQueryParams.safeParse(req.query);
  const filter: Record<string, unknown> = {};
  if (params.success && params.data.status) {
    filter.status = params.data.status;
  }
  const reviews = await ReviewModel.find(filter).sort({ createdAt: 1 });
  res.json(reviews);
});

router.post("/reviews", async (req, res): Promise<void> => {
  const parsed = CreateReviewBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const review = await ReviewModel.create({ ...parsed.data, status: "pending" });
  res.status(201).json(review);
});

router.get("/reviews/public", async (_req, res): Promise<void> => {
  const reviews = await ReviewModel.find({ status: "approved" }).sort({ createdAt: 1 });
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;
  res.json({
    reviews,
    averageRating: Math.round(avgRating * 10) / 10,
    totalCount: reviews.length,
  });
});

router.patch("/reviews/:id", async (req, res): Promise<void> => {
  const parsed = UpdateReviewBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  try {
    const review = await ReviewModel.findByIdAndUpdate(req.params.id, parsed.data, { new: true });
    if (!review) {
      res.status(404).json({ error: "Review not found" });
      return;
    }
    res.json(review);
  } catch {
    res.status(404).json({ error: "Review not found" });
  }
});

router.delete("/reviews/:id", async (req, res): Promise<void> => {
  try {
    await ReviewModel.findByIdAndDelete(req.params.id);
  } catch { /* ignore invalid id */ }
  res.sendStatus(204);
});

export default router;
