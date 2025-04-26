import { 
  users, type User, type InsertUser,
  skills, type Skill, type InsertSkill,
  sessions, type Session, type InsertSession,
  reviews, type Review, type InsertReview
} from "@shared/schema";
import { db } from "./db";
import { eq, and, or, desc, isNull } from "drizzle-orm";
import connectPg from "connect-pg-simple";
import session from "express-session";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserCredits(userId: number, credits: number): Promise<User>;
  
  // Skill methods
  getSkillsByUser(userId: number, isTeaching: boolean): Promise<Skill[]>;
  getSkill(id: number): Promise<Skill | undefined>;
  createSkill(skill: InsertSkill): Promise<Skill>;
  
  // Session methods
  getSession(id: number): Promise<Session | undefined>;
  getSessionsByTeacher(teacherId: number): Promise<Session[]>;
  getSessionsByStudent(studentId: number): Promise<Session[]>;
  getAvailableSessions(): Promise<Session[]>;
  createSession(session: InsertSession): Promise<Session>;
  updateSessionStatus(id: number, status: string, studentId?: number): Promise<Session>;
  
  // Review methods
  getReviewsBySession(sessionId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  
  // Session store for authentication
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;
  
  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true,
      tableName: 'session' 
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUserCredits(userId: number, credits: number): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ credits })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }
  
  // Skill methods
  async getSkillsByUser(userId: number, isTeaching: boolean): Promise<Skill[]> {
    return await db
      .select()
      .from(skills)
      .where(and(
        eq(skills.userId, userId),
        eq(skills.isTeaching, isTeaching)
      ))
      .orderBy(desc(skills.createdAt));
  }
  
  async getSkill(id: number): Promise<Skill | undefined> {
    const [skill] = await db.select().from(skills).where(eq(skills.id, id));
    return skill;
  }
  
  async createSkill(insertSkill: InsertSkill): Promise<Skill> {
    const [skill] = await db.insert(skills).values(insertSkill).returning();
    return skill;
  }
  
  // Session methods
  async getSession(id: number): Promise<Session | undefined> {
    const [session] = await db.select().from(sessions).where(eq(sessions.id, id));
    return session;
  }
  
  async getSessionsByTeacher(teacherId: number): Promise<Session[]> {
    return await db
      .select()
      .from(sessions)
      .where(eq(sessions.teacherId, teacherId))
      .orderBy(desc(sessions.createdAt));
  }
  
  async getSessionsByStudent(studentId: number): Promise<Session[]> {
    return await db
      .select()
      .from(sessions)
      .where(eq(sessions.studentId, studentId))
      .orderBy(desc(sessions.createdAt));
  }
  
  async getAvailableSessions(): Promise<Session[]> {
    return await db
      .select()
      .from(sessions)
      .where(and(
        eq(sessions.status, "open"),
        isNull(sessions.studentId)
      ))
      .orderBy(desc(sessions.createdAt));
  }
  
  async createSession(insertSession: InsertSession): Promise<Session> {
    const [session] = await db.insert(sessions).values(insertSession).returning();
    return session;
  }
  
  async updateSessionStatus(id: number, status: string, studentId?: number): Promise<Session> {
    const updateData: Partial<Session> = { status };
    if (studentId !== undefined) {
      updateData.studentId = studentId;
    }
    
    const [session] = await db
      .update(sessions)
      .set(updateData)
      .where(eq(sessions.id, id))
      .returning();
    return session;
  }
  
  // Review methods
  async getReviewsBySession(sessionId: number): Promise<Review[]> {
    return await db
      .select()
      .from(reviews)
      .where(eq(reviews.sessionId, sessionId))
      .orderBy(desc(reviews.createdAt));
  }
  
  async createReview(insertReview: InsertReview): Promise<Review> {
    const [review] = await db.insert(reviews).values(insertReview).returning();
    return review;
  }
}

export const storage = new DatabaseStorage();
