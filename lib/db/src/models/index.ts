import mongoose, { Schema, type Document, type Model } from "mongoose";

// Shared toJSON transform: maps _id → id (string), strips _id and __v
const jsonTransform = (_doc: Document, ret: Record<string, unknown>) => {
  ret.id = (ret._id as mongoose.Types.ObjectId).toString();
  delete ret._id;
  delete ret.__v;
  return ret;
};

const baseOptions = {
  timestamps: true,
  toJSON: { transform: jsonTransform },
};

// ─── Service ──────────────────────────────────────────────────────────────────

export interface IService extends Document {
  title: string;
  description: string;
  category: string;
  icon?: string | null;
  bannerUrl?: string | null;
  galleryUrls?: string | null;
  pricing?: string | null;
  buttonText?: string | null;
  destinationUrl?: string | null;
  published: boolean;
  featured: boolean;
  sortOrder: number;
}

const serviceSchema = new Schema<IService>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    icon: { type: String, default: null },
    bannerUrl: { type: String, default: null },
    galleryUrls: { type: String, default: null },
    pricing: { type: String, default: null },
    buttonText: { type: String, default: null },
    destinationUrl: { type: String, default: null },
    published: { type: Boolean, required: true, default: false },
    featured: { type: Boolean, required: true, default: false },
    sortOrder: { type: Number, required: true, default: 0 },
  },
  baseOptions,
);

export const ServiceModel: Model<IService> =
  (mongoose.models["Service"] as Model<IService>) ||
  mongoose.model<IService>("Service", serviceSchema);

// ─── Project (Portfolio) ───────────────────────────────────────────────────────

export interface IProject extends Document {
  title: string;
  description: string;
  technologies?: string | null;
  screenshotUrls?: string | null;
  videoUrl?: string | null;
  githubUrl?: string | null;
  liveDemoUrl?: string | null;
  published: boolean;
  featured: boolean;
  category?: string | null;
}

const projectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    technologies: { type: String, default: null },
    screenshotUrls: { type: String, default: null },
    videoUrl: { type: String, default: null },
    githubUrl: { type: String, default: null },
    liveDemoUrl: { type: String, default: null },
    published: { type: Boolean, required: true, default: false },
    featured: { type: Boolean, required: true, default: false },
    category: { type: String, default: null },
  },
  baseOptions,
);

export const ProjectModel: Model<IProject> =
  (mongoose.models["Project"] as Model<IProject>) ||
  mongoose.model<IProject>("Project", projectSchema);

// ─── Tutorial ─────────────────────────────────────────────────────────────────

export interface ITutorial extends Document {
  title: string;
  description: string;
  category: string;
  thumbnailUrl?: string | null;
  videoUrl?: string | null;
  youtubeEmbedUrl?: string | null;
  downloadableResources?: string | null;
  published: boolean;
  duration?: string | null;
  difficulty?: string | null;
}

const tutorialSchema = new Schema<ITutorial>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    thumbnailUrl: { type: String, default: null },
    videoUrl: { type: String, default: null },
    youtubeEmbedUrl: { type: String, default: null },
    downloadableResources: { type: String, default: null },
    published: { type: Boolean, required: true, default: false },
    duration: { type: String, default: null },
    difficulty: { type: String, default: null },
  },
  baseOptions,
);

export const TutorialModel: Model<ITutorial> =
  (mongoose.models["Tutorial"] as Model<ITutorial>) ||
  mongoose.model<ITutorial>("Tutorial", tutorialSchema);

// ─── BlogPost ─────────────────────────────────────────────────────────────────

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null;
  category: string;
  featuredImageUrl?: string | null;
  published: boolean;
  scheduledAt?: string | null;
  authorName?: string | null;
  tags?: string | null;
}

const blogPostSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    excerpt: { type: String, default: null },
    category: { type: String, required: true },
    featuredImageUrl: { type: String, default: null },
    published: { type: Boolean, required: true, default: false },
    scheduledAt: { type: String, default: null },
    authorName: { type: String, default: null },
    tags: { type: String, default: null },
  },
  baseOptions,
);

export const BlogPostModel: Model<IBlogPost> =
  (mongoose.models["BlogPost"] as Model<IBlogPost>) ||
  mongoose.model<IBlogPost>("BlogPost", blogPostSchema);

// ─── Review ───────────────────────────────────────────────────────────────────

export interface IReview extends Document {
  name: string;
  email: string;
  rating: number;
  testimonial: string;
  status: string;
  featured: boolean;
  adminReply?: string | null;
}

const reviewSchema = new Schema<IReview>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    rating: { type: Number, required: true },
    testimonial: { type: String, required: true },
    status: { type: String, required: true, default: "pending" },
    featured: { type: Boolean, required: true, default: false },
    adminReply: { type: String, default: null },
  },
  baseOptions,
);

export const ReviewModel: Model<IReview> =
  (mongoose.models["Review"] as Model<IReview>) ||
  mongoose.model<IReview>("Review", reviewSchema);

// ─── ContactMessage ───────────────────────────────────────────────────────────

export interface IContactMessage extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string | null;
  read: boolean;
}

const contactMessageSchema = new Schema<IContactMessage>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    phone: { type: String, default: null },
    read: { type: Boolean, required: true, default: false },
  },
  baseOptions,
);

export const ContactMessageModel: Model<IContactMessage> =
  (mongoose.models["ContactMessage"] as Model<IContactMessage>) ||
  mongoose.model<IContactMessage>("ContactMessage", contactMessageSchema);

// ─── QuoteRequest ─────────────────────────────────────────────────────────────

export interface IQuoteRequest extends Document {
  name: string;
  email: string;
  phone?: string | null;
  projectType: string;
  description: string;
  budget?: string | null;
  timeline?: string | null;
  status: string;
}

const quoteRequestSchema = new Schema<IQuoteRequest>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: null },
    projectType: { type: String, required: true },
    description: { type: String, required: true },
    budget: { type: String, default: null },
    timeline: { type: String, default: null },
    status: { type: String, required: true, default: "pending" },
  },
  baseOptions,
);

export const QuoteRequestModel: Model<IQuoteRequest> =
  (mongoose.models["QuoteRequest"] as Model<IQuoteRequest>) ||
  mongoose.model<IQuoteRequest>("QuoteRequest", quoteRequestSchema);

// ─── NewsletterSubscription ───────────────────────────────────────────────────

export interface INewsletterSubscription extends Document {
  email: string;
}

const newsletterSubscriptionSchema = new Schema<INewsletterSubscription>(
  {
    email: { type: String, required: true, unique: true },
  },
  baseOptions,
);

export const NewsletterSubscriptionModel: Model<INewsletterSubscription> =
  (mongoose.models["NewsletterSubscription"] as Model<INewsletterSubscription>) ||
  mongoose.model<INewsletterSubscription>(
    "NewsletterSubscription",
    newsletterSubscriptionSchema,
  );

// ─── SiteSettings (singleton) ─────────────────────────────────────────────────

export interface ISiteSettings extends Document {
  siteName?: string;
  tagline?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  whatsappChannelUrl?: string;
  whatsappGroupUrl?: string;
  address?: string;
  googleMapsUrl?: string;
  logoUrl?: string;
  faviconUrl?: string;
  tiktokUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  youtubeUrl?: string;
  twitterUrl?: string;
  mpesaNumber?: string;
  paypalEmail?: string;
  donationMessage?: string;
  metaDescription?: string;
  metaKeywords?: string;
}

const siteSettingsSchema = new Schema<ISiteSettings>(
  {
    siteName: { type: String, default: "FireboxTechStudios" },
    tagline: { type: String, default: "Building the Future, One Line at a Time" },
    email: { type: String, default: "info@fireboxtechstudios.com" },
    phone: { type: String, default: null },
    whatsapp: { type: String, default: null },
    whatsappChannelUrl: { type: String, default: null },
    whatsappGroupUrl: { type: String, default: null },
    address: { type: String, default: null },
    googleMapsUrl: { type: String, default: null },
    logoUrl: { type: String, default: null },
    faviconUrl: { type: String, default: null },
    tiktokUrl: { type: String, default: null },
    facebookUrl: { type: String, default: null },
    instagramUrl: { type: String, default: null },
    linkedinUrl: { type: String, default: null },
    githubUrl: { type: String, default: null },
    youtubeUrl: { type: String, default: null },
    twitterUrl: { type: String, default: null },
    mpesaNumber: { type: String, default: null },
    paypalEmail: { type: String, default: null },
    donationMessage: { type: String, default: null },
    metaDescription: {
      type: String,
      default:
        "FireboxTechStudios - Professional software solutions for AI, web development, mobile apps, cybersecurity, and cloud computing.",
    },
    metaKeywords: {
      type: String,
      default:
        "software development, AI, web development, mobile apps, cybersecurity, cloud computing",
    },
  },
  baseOptions,
);

export const SiteSettingsModel: Model<ISiteSettings> =
  (mongoose.models["SiteSettings"] as Model<ISiteSettings>) ||
  mongoose.model<ISiteSettings>("SiteSettings", siteSettingsSchema);

// ─── TeamMember ───────────────────────────────────────────────────────────────

export interface ITeamMember extends Document {
  name: string;
  role: string;
  bio?: string | null;
  avatarUrl?: string | null;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  twitterUrl?: string | null;
  sortOrder: number;
}

const teamMemberSchema = new Schema<ITeamMember>(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    bio: { type: String, default: null },
    avatarUrl: { type: String, default: null },
    linkedinUrl: { type: String, default: null },
    githubUrl: { type: String, default: null },
    twitterUrl: { type: String, default: null },
    sortOrder: { type: Number, required: true, default: 0 },
  },
  baseOptions,
);

export const TeamMemberModel: Model<ITeamMember> =
  (mongoose.models["TeamMember"] as Model<ITeamMember>) ||
  mongoose.model<ITeamMember>("TeamMember", teamMemberSchema);

// ─── FaqItem ──────────────────────────────────────────────────────────────────

export interface IFaqItem extends Document {
  question: string;
  answer: string;
  category?: string | null;
  sortOrder: number;
}

const faqItemSchema = new Schema<IFaqItem>(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { type: String, default: null },
    sortOrder: { type: Number, required: true, default: 0 },
  },
  baseOptions,
);

export const FaqItemModel: Model<IFaqItem> =
  (mongoose.models["FaqItem"] as Model<IFaqItem>) ||
  mongoose.model<IFaqItem>("FaqItem", faqItemSchema);

// ─── TrustedClient ────────────────────────────────────────────────────────────

export interface ITrustedClient extends Document {
  name: string;
  logoUrl?: string | null;
  websiteUrl?: string | null;
  sortOrder: number;
}

const trustedClientSchema = new Schema<ITrustedClient>(
  {
    name: { type: String, required: true },
    logoUrl: { type: String, default: null },
    websiteUrl: { type: String, default: null },
    sortOrder: { type: Number, required: true, default: 0 },
  },
  baseOptions,
);

export const TrustedClientModel: Model<ITrustedClient> =
  (mongoose.models["TrustedClient"] as Model<ITrustedClient>) ||
  mongoose.model<ITrustedClient>("TrustedClient", trustedClientSchema);

// ─── Job ──────────────────────────────────────────────────────────────────────

export interface IJob extends Document {
  title: string;
  department: string;
  type: string;
  location: string;
  description: string;
  requirements?: string | null;
  salaryRange?: string | null;
  active: boolean;
  applicationUrl?: string | null;
}

const jobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true },
    department: { type: String, required: true },
    type: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    requirements: { type: String, default: null },
    salaryRange: { type: String, default: null },
    active: { type: Boolean, required: true, default: true },
    applicationUrl: { type: String, default: null },
  },
  baseOptions,
);

export const JobModel: Model<IJob> =
  (mongoose.models["Job"] as Model<IJob>) ||
  mongoose.model<IJob>("Job", jobSchema);
