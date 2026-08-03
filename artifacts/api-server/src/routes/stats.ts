import { Router, type IRouter } from "express";
import {
  ServiceModel,
  ProjectModel,
  TutorialModel,
  BlogPostModel,
  ReviewModel,
  ContactMessageModel,
  QuoteRequestModel,
  NewsletterSubscriptionModel,
  JobModel,
} from "@workspace/db";

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
    ServiceModel.find(),
    ProjectModel.find(),
    TutorialModel.find(),
    BlogPostModel.find(),
    ReviewModel.find(),
    ContactMessageModel.find(),
    QuoteRequestModel.find(),
    NewsletterSubscriptionModel.find(),
    JobModel.find(),
  ]);

  const approvedReviews = reviews.filter((r) => r.status === "approved");
  const avgRating =
    approvedReviews.length > 0
      ? approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length
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
