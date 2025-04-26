import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  avatar: text("avatar"),
  bio: text("bio"),
  credits: integer("credits").default(5).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userRelations = relations(users, ({ many }) => ({
  teachingSkills: many(skills, { relationName: "userTeachingSkills" }),
  learningSkills: many(skills, { relationName: "userLearningSkills" }),
  sessionsTaught: many(sessions, { relationName: "teacher" }),
  sessionsAttended: many(sessions, { relationName: "student" }),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  avatar: true,
  bio: true,
});

// Define skill categories
export const SKILL_CATEGORIES = [
  "technology",
  "language",
  "arts",
  "business",
  "health",
  "music",
  "sports",
  "cooking",
  "academic",
  "other",
] as const;

// Define skill levels
export const SKILL_LEVELS = ["beginner", "intermediate", "advanced"] as const;

// Skills model
export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  userId: integer("user_id").notNull(),
  isTeaching: boolean("is_teaching").notNull(),
  skillLevel: text("skill_level").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const skillRelations = relations(skills, ({ one }) => ({
  user: one(users, {
    fields: [skills.userId],
    references: [users.id],
    relationName: skills.isTeaching ? "userTeachingSkills" : "userLearningSkills",
  }),
}));

export const insertSkillSchema = createInsertSchema(skills).pick({
  name: true,
  category: true,
  description: true,
  userId: true,
  isTeaching: true,
  skillLevel: true,
});

// Sessions model
export const sessions = pgTable("teaching_sessions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  teacherId: integer("teacher_id").notNull(),
  studentId: integer("student_id"),
  skillId: integer("skill_id").notNull(),
  dateTime: timestamp("date_time").notNull(),
  duration: integer("duration").notNull(), // in minutes
  location: text("location"), // could be "online" or physical location
  meetingLink: text("meeting_link"),
  status: text("status").default("open").notNull(), // open, booked, completed, cancelled
  creditCost: integer("credit_cost").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const sessionRelations = relations(sessions, ({ one }) => ({
  teacher: one(users, {
    fields: [sessions.teacherId],
    references: [users.id],
    relationName: "teacher",
  }),
  student: one(users, {
    fields: [sessions.studentId],
    references: [users.id],
    relationName: "student",
  }),
  skill: one(skills, {
    fields: [sessions.skillId],
    references: [skills.id],
  }),
}));

export const insertSessionSchema = createInsertSchema(sessions).pick({
  title: true,
  description: true,
  teacherId: true,
  studentId: true,
  skillId: true,
  dateTime: true,
  duration: true,
  location: true,
  meetingLink: true,
  creditCost: true,
});

// Reviews model
export const reviews = pgTable("session_reviews", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").notNull(),
  reviewerId: integer("reviewer_id").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reviewRelations = relations(reviews, ({ one }) => ({
  session: one(sessions, {
    fields: [reviews.sessionId],
    references: [sessions.id],
  }),
  reviewer: one(users, {
    fields: [reviews.reviewerId],
    references: [users.id],
  }),
}));

export const insertReviewSchema = createInsertSchema(reviews).pick({
  sessionId: true,
  reviewerId: true,
  rating: true,
  comment: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Skill = typeof skills.$inferSelect;
export type InsertSkill = z.infer<typeof insertSkillSchema>;

export type Session = typeof sessions.$inferSelect;
export type InsertSession = z.infer<typeof insertSessionSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

export type SkillCategory = typeof SKILL_CATEGORIES[number];
export type SkillLevel = typeof SKILL_LEVELS[number];
