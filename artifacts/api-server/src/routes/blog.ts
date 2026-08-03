import { Router, type IRouter } from "express";
import { BlogPostModel } from "@workspace/db";
import {
  CreateBlogPostBody,
  UpdateBlogPostBody,
  ListBlogPostsQueryParams,
  ListPublicBlogPostsQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/blog", async (req, res): Promise<void> => {
  const params = ListBlogPostsQueryParams.safeParse(req.query);
  let posts = await BlogPostModel.find().sort({ createdAt: -1 });
  if (params.success) {
    if (params.data.published != null) {
      const pub = params.data.published === "true";
      posts = posts.filter((p) => p.published === pub);
    }
    if (params.data.category) {
      posts = posts.filter((p) => p.category === params.data.category);
    }
    if (params.data.search) {
      const q = params.data.search.toLowerCase();
      posts = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q),
      );
    }
  }
  res.json(posts);
});

router.post("/blog", async (req, res): Promise<void> => {
  const parsed = CreateBlogPostBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const slug =
    parsed.data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") +
    "-" +
    Date.now();
  const post = await BlogPostModel.create({ ...parsed.data, slug });
  res.status(201).json(post);
});

router.get("/blog/public", async (req, res): Promise<void> => {
  const params = ListPublicBlogPostsQueryParams.safeParse(req.query);
  let posts = await BlogPostModel.find({ published: true }).sort({ createdAt: -1 });
  if (params.success) {
    if (params.data.category) {
      posts = posts.filter((p) => p.category === params.data.category);
    }
    if (params.data.search) {
      const q = params.data.search.toLowerCase();
      posts = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q),
      );
    }
  }
  res.json(posts);
});

router.get("/blog/recent", async (_req, res): Promise<void> => {
  const posts = await BlogPostModel.find({ published: true }).sort({ createdAt: -1 }).limit(3);
  res.json(posts);
});

router.get("/blog/:id", async (req, res): Promise<void> => {
  try {
    const post = await BlogPostModel.findById(req.params.id);
    if (!post) {
      res.status(404).json({ error: "Blog post not found" });
      return;
    }
    res.json(post);
  } catch {
    res.status(404).json({ error: "Blog post not found" });
  }
});

router.patch("/blog/:id", async (req, res): Promise<void> => {
  const parsed = UpdateBlogPostBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  try {
    const post = await BlogPostModel.findByIdAndUpdate(req.params.id, parsed.data, { new: true });
    if (!post) {
      res.status(404).json({ error: "Blog post not found" });
      return;
    }
    res.json(post);
  } catch {
    res.status(404).json({ error: "Blog post not found" });
  }
});

router.delete("/blog/:id", async (req, res): Promise<void> => {
  try {
    await BlogPostModel.findByIdAndDelete(req.params.id);
  } catch { /* ignore invalid id */ }
  res.sendStatus(204);
});

export default router;
