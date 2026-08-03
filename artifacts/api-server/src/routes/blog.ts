import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, blogPostsTable } from "@workspace/db";
import {
  CreateBlogPostBody,
  UpdateBlogPostBody,
  UpdateBlogPostParams,
  GetBlogPostParams,
  DeleteBlogPostParams,
  ListBlogPostsQueryParams,
  ListPublicBlogPostsQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/blog", async (req, res): Promise<void> => {
  const params = ListBlogPostsQueryParams.safeParse(req.query);
  let posts = await db.select().from(blogPostsTable).orderBy(desc(blogPostsTable.createdAt));
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
        (p) => p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q),
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
  const slug = parsed.data.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") + "-" + Date.now();
  const [post] = await db.insert(blogPostsTable).values({ ...parsed.data, slug }).returning();
  res.status(201).json(post);
});

router.get("/blog/public", async (req, res): Promise<void> => {
  const params = ListPublicBlogPostsQueryParams.safeParse(req.query);
  let posts = await db
    .select()
    .from(blogPostsTable)
    .where(eq(blogPostsTable.published, true))
    .orderBy(desc(blogPostsTable.createdAt));
  if (params.success) {
    if (params.data.category) {
      posts = posts.filter((p) => p.category === params.data.category);
    }
    if (params.data.search) {
      const q = params.data.search.toLowerCase();
      posts = posts.filter(
        (p) => p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q),
      );
    }
  }
  res.json(posts);
});

router.get("/blog/recent", async (_req, res): Promise<void> => {
  const posts = await db
    .select()
    .from(blogPostsTable)
    .where(eq(blogPostsTable.published, true))
    .orderBy(desc(blogPostsTable.createdAt))
    .limit(3);
  res.json(posts);
});

router.get("/blog/:id", async (req, res): Promise<void> => {
  const params = GetBlogPostParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [post] = await db.select().from(blogPostsTable).where(eq(blogPostsTable.id, params.data.id));
  if (!post) {
    res.status(404).json({ error: "Blog post not found" });
    return;
  }
  res.json(post);
});

router.patch("/blog/:id", async (req, res): Promise<void> => {
  const params = UpdateBlogPostParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateBlogPostBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [post] = await db
    .update(blogPostsTable)
    .set(parsed.data)
    .where(eq(blogPostsTable.id, params.data.id))
    .returning();
  if (!post) {
    res.status(404).json({ error: "Blog post not found" });
    return;
  }
  res.json(post);
});

router.delete("/blog/:id", async (req, res): Promise<void> => {
  const params = DeleteBlogPostParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  await db.delete(blogPostsTable).where(eq(blogPostsTable.id, params.data.id));
  res.sendStatus(204);
});

export default router;
