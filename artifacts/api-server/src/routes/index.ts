import { Router, type IRouter } from "express";
import healthRouter from "./health";
import servicesRouter from "./services";
import portfolioRouter from "./portfolio";
import tutorialsRouter from "./tutorials";
import blogRouter from "./blog";
import reviewsRouter from "./reviews";
import contactRouter from "./contact";
import quotesRouter from "./quotes";
import newsletterRouter from "./newsletter";
import settingsRouter from "./settings";
import teamRouter from "./team";
import faqRouter from "./faq";
import jobsRouter from "./jobs";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use(statsRouter);
router.use(servicesRouter);
router.use(portfolioRouter);
router.use(tutorialsRouter);
router.use(blogRouter);
router.use(reviewsRouter);
router.use(contactRouter);
router.use(quotesRouter);
router.use(newsletterRouter);
router.use(settingsRouter);
router.use(teamRouter);
router.use(faqRouter);
router.use(jobsRouter);

export default router;
