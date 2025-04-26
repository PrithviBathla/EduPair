import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  avatar: text("avatar"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  avatar: true,
});

// Define resource types
export const RESOURCE_TYPES = [
  "course",
  "ebook",
  "video",
  "tutorial",
  "interactive",
] as const;

// Define skill levels
export const SKILL_LEVELS = ["beginner", "intermediate", "advanced"] as const;

// Resources model
export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  skillLevel: text("skill_level").notNull(),
  resourceType: text("resource_type").notNull(),
  duration: text("duration"),
  price: text("price").default("Free"),
  tags: text("tags").array(),
  content: text("content"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertResourceSchema = createInsertSchema(resources).pick({
  title: true,
  description: true,
  imageUrl: true,
  skillLevel: true,
  resourceType: true,
  duration: true,
  price: true,
  tags: true,
  content: true,
});

// Reviews model
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  resourceId: integer("resource_id").notNull(),
  userId: integer("user_id").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertReviewSchema = createInsertSchema(reviews).pick({
  resourceId: true,
  userId: true,
  rating: true,
  comment: true,
});

// Resource with aggregated rating
export const resourceWithRatingSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  imageUrl: z.string().nullable(),
  skillLevel: z.string(),
  resourceType: z.string(),
  duration: z.string().nullable(),
  price: z.string(),
  tags: z.array(z.string()).nullable(),
  content: z.string().nullable(),
  createdAt: z.string().nullable(),
  averageRating: z.number().nullable(),
  reviewCount: z.number().default(0),
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Resource = typeof resources.$inferSelect;
export type InsertResource = z.infer<typeof insertResourceSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

export type ResourceType = typeof RESOURCE_TYPES[number];
export type SkillLevel = typeof SKILL_LEVELS[number];

export type ResourceWithRating = z.infer<typeof resourceWithRatingSchema>;
