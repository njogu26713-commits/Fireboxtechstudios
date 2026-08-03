import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, tutorialsTable } from "@workspace/db";
import {
  CreateTutorialBody,
  UpdateTutorialBody,
  UpdateTutorialParams,
  GetTutorialParams,
  DeleteTutorialParams,
  ListTutorialsQueryParams,
  ListPublicTutorialsQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/tutorials", async (req, res): Promise<void> => {
  const params = ListTutorialsQueryParams.safeParse(req.query);
  let tutorials = await db.select().from(tutorialsTable).orderBy(tutorialsTable.createdAt);
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
        (t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q),
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
  const [tutorial] = await db.insert(tutorialsTable).values(parsed.data).returning();
  res.status(201).json(tutorial);
});

router.get("/tutorials/public", async (req, res): Promise<void> => {
  const params = ListPublicTutorialsQueryParams.safeParse(req.query);
  let tutorials = await db
    .select()
    .from(tutorialsTable)
    .where(eq(tutorialsTable.published, true))
    .orderBy(tutorialsTable.createdAt);
  if (params.success) {
    if (params.data.category) {
      tutorials = tutorials.filter((t) => t.category === params.data.category);
    }
    if (params.data.search) {
      const q = params.data.search.toLowerCase();
      tutorials = tutorials.filter(
        (t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q),
      );
    }
  }
  res.json(tutorials);
});

router.get("/tutorials/:id", async (req, res): Promise<void> => {
  const params = GetTutorialParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [tutorial] = await db.select().from(tutorialsTable).where(eq(tutorialsTable.id, params.data.id));
  if (!tutorial) {
    res.status(404).json({ error: "Tutorial not found" });
    return;
  }
  res.json(tutorial);
});

router.patch("/tutorials/:id", async (req, res): Promise<void> => {
  const params = UpdateTutorialParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateTutorialBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [tutorial] = await db
    .update(tutorialsTable)
    .set(parsed.data)
    .where(eq(tutorialsTable.id, params.data.id))
    .returning();
  if (!tutorial) {
    res.status(404).json({ error: "Tutorial not found" });
    return;
  }
  res.json(tutorial);
});

router.delete("/tutorials/:id", async (req, res): Promise<void> => {
  const params = DeleteTutorialParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  await db.delete(tutorialsTable).where(eq(tutorialsTable.id, params.data.id));
  res.sendStatus(204);
});

export default router;
