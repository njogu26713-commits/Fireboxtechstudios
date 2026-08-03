import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const siteSettingsTable = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  siteName: text("site_name").notNull().default("FireboxTechStudios"),
  tagline: text("tagline").notNull().default("Building the Future with Technology"),
  email: text("email").default("info@fireboxtechstudios.com"),
  phone: text("phone").default("+1 (555) 000-0000"),
  whatsapp: text("whatsapp").default("+1 (555) 000-0000"),
  whatsappChannelUrl: text("whatsapp_channel_url").default("https://whatsapp.com/channel/"),
  whatsappGroupUrl: text("whatsapp_group_url").default("https://chat.whatsapp.com/"),
  address: text("address").default("123 Tech Avenue, Silicon Valley, CA"),
  googleMapsUrl: text("google_maps_url").default("https://maps.google.com"),
  logoUrl: text("logo_url"),
  faviconUrl: text("favicon_url"),
  tiktokUrl: text("tiktok_url").default("https://tiktok.com/@fireboxtechstudios"),
  facebookUrl: text("facebook_url").default("https://facebook.com/fireboxtechstudios"),
  instagramUrl: text("instagram_url").default("https://instagram.com/fireboxtechstudios"),
  linkedinUrl: text("linkedin_url").default("https://linkedin.com/company/fireboxtechstudios"),
  githubUrl: text("github_url").default("https://github.com/fireboxtechstudios"),
  youtubeUrl: text("youtube_url").default("https://youtube.com/@fireboxtechstudios"),
  twitterUrl: text("twitter_url").default("https://twitter.com/fireboxtechstudios"),
  mpesaNumber: text("mpesa_number").default(""),
  paypalEmail: text("paypal_email").default(""),
  donationMessage: text("donation_message").default("Love our work? Buy us a soda! Every contribution helps us build more software, AI tools, and free tutorials."),
  metaDescription: text("meta_description").default("FireboxTechStudios - Premium software solutions in AI, Web Development, Mobile Apps, Cybersecurity, Cloud Computing and more."),
  metaKeywords: text("meta_keywords").default("software development, AI, web development, mobile apps, cybersecurity, cloud computing"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertSiteSettingsSchema = createInsertSchema(siteSettingsTable).omit({ id: true, updatedAt: true });
export type InsertSiteSettings = z.infer<typeof insertSiteSettingsSchema>;
export type SiteSettings = typeof siteSettingsTable.$inferSelect;
