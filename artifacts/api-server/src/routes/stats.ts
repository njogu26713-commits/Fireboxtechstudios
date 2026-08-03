import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, servicesTable, projectsTable, tutorialsTable, blogPostsTable, reviewsTable, contactMessagesTable, quoteRequestsTable, newsletterSubscriptionsTable, jobsTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/stats/dashboard", async (_req, res): Promise<void> => {
  const [
    services,
    projects,
    tutorials,
    blogPosts,
    reviews,
    messages,
    quotes,
    subscribers,
    jobs,
  ] = await Promise.all([
    db.select().from(servicesTable),
    db.select().from(projectsTable),
    db.select().from(tutorialsTable),
    db.select().from(blogPostsTable),
    db.select().from(reviewsTable),
    db.select().from(contactMessagesTable),
    db.select().from(quoteRequestsTable),
    db.select().from(newsletterSubscriptionsTable),
    db.select().from(jobsTable),
  ]);

  const approvedReviews = reviews.filter((r) => r.status === "approved");
  const avgRating =
    approvedReviews.length > 0
      ? approvedReviews.reduce((s, r) => s + r.rating, 0) / approvedReviews.length
      : 0;

  res.json({
    totalServices: services.length,
    totalProjects: projects.length,
    totalTutorials: tutorials.length,
    totalBlogPosts: blogPosts.length,
    totalReviews: reviews.length,
    pendingReviews: reviews.filter((r) => r.status === "pending").length,
    totalMessages: messages.length,
    totalQuotes: quotes.length,
    totalSubscribers: subscribers.length,
    totalJobs: jobs.length,
    avgRating: Math.round(avgRating * 10) / 10,
  });
});

export default router;
