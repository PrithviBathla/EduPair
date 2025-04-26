import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { 
  insertSkillSchema, 
  insertSessionSchema, 
  insertReviewSchema 
} from "@shared/schema";
import { z } from "zod";

// Middleware to check if user is authenticated
const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Skills API routes
  app.get("/api/skills/teaching", isAuthenticated, async (req, res, next) => {
    try {
      const userId = req.user!.id;
      const skills = await storage.getSkillsByUser(userId, true);
      res.json(skills);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/skills/learning", isAuthenticated, async (req, res, next) => {
    try {
      const userId = req.user!.id;
      const skills = await storage.getSkillsByUser(userId, false);
      res.json(skills);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/skills/:id", isAuthenticated, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const skill = await storage.getSkill(id);
      
      if (!skill) {
        return res.status(404).json({ message: "Skill not found" });
      }
      
      res.json(skill);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/skills", isAuthenticated, async (req, res, next) => {
    try {
      const userId = req.user!.id;
      const result = insertSkillSchema.safeParse({ ...req.body, userId });
      
      if (!result.success) {
        return res.status(400).json({ errors: result.error.format() });
      }
      
      const skill = await storage.createSkill(result.data);
      res.status(201).json(skill);
    } catch (error) {
      next(error);
    }
  });

  // Sessions API routes
  app.get("/api/sessions", isAuthenticated, async (req, res, next) => {
    try {
      const sessions = await storage.getAvailableSessions();
      res.json(sessions);
    } catch (error) {
      next(error);
    }
  });
  
  app.get("/api/sessions/teaching", isAuthenticated, async (req, res, next) => {
    try {
      const userId = req.user!.id;
      const sessions = await storage.getSessionsByTeacher(userId);
      res.json(sessions);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/sessions/learning", isAuthenticated, async (req, res, next) => {
    try {
      const userId = req.user!.id;
      const sessions = await storage.getSessionsByStudent(userId);
      res.json(sessions);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/sessions/:id", isAuthenticated, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const session = await storage.getSession(id);
      
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      res.json(session);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/sessions", isAuthenticated, async (req, res, next) => {
    try {
      const teacherId = req.user!.id;
      const result = insertSessionSchema.safeParse({ ...req.body, teacherId });
      
      if (!result.success) {
        return res.status(400).json({ errors: result.error.format() });
      }
      
      const session = await storage.createSession(result.data);
      res.status(201).json(session);
    } catch (error) {
      next(error);
    }
  });

  // Book a session
  app.post("/api/sessions/:id/book", isAuthenticated, async (req, res, next) => {
    try {
      const sessionId = parseInt(req.params.id);
      const studentId = req.user!.id;
      
      // Get the session
      const session = await storage.getSession(sessionId);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      // Check if session is available
      if (session.status !== "open" || session.studentId) {
        return res.status(400).json({ message: "Session is not available for booking" });
      }
      
      // Check if user has enough credits
      const user = req.user!;
      if (user.credits < session.creditCost) {
        return res.status(400).json({ message: "Not enough credits" });
      }
      
      // Update session status
      const updatedSession = await storage.updateSessionStatus(sessionId, "booked", studentId);
      
      // Deduct credits from student
      const updatedStudent = await storage.updateUserCredits(
        studentId, 
        user.credits - session.creditCost
      );
      
      // Add credits to teacher (transaction should be handled in a real app)
      const teacher = await storage.getUser(session.teacherId);
      if (teacher) {
        await storage.updateUserCredits(
          teacher.id,
          teacher.credits + session.creditCost
        );
      }
      
      res.json(updatedSession);
    } catch (error) {
      next(error);
    }
  });

  // Mark session as completed
  app.post("/api/sessions/:id/complete", isAuthenticated, async (req, res, next) => {
    try {
      const sessionId = parseInt(req.params.id);
      const userId = req.user!.id;
      
      // Get the session
      const session = await storage.getSession(sessionId);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      // Check if user is the teacher for this session
      if (session.teacherId !== userId) {
        return res.status(403).json({ message: "Only the teacher can mark a session as completed" });
      }
      
      // Check if session can be completed
      if (session.status !== "booked") {
        return res.status(400).json({ message: "Only booked sessions can be completed" });
      }
      
      // Update session status
      const updatedSession = await storage.updateSessionStatus(sessionId, "completed");
      
      res.json(updatedSession);
    } catch (error) {
      next(error);
    }
  });

  // Reviews API routes
  app.get("/api/sessions/:id/reviews", isAuthenticated, async (req, res, next) => {
    try {
      const sessionId = parseInt(req.params.id);
      const reviews = await storage.getReviewsBySession(sessionId);
      res.json(reviews);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/sessions/:id/reviews", isAuthenticated, async (req, res, next) => {
    try {
      const sessionId = parseInt(req.params.id);
      const reviewerId = req.user!.id;
      
      // Get the session
      const session = await storage.getSession(sessionId);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      // Check if session is completed
      if (session.status !== "completed") {
        return res.status(400).json({ message: "Only completed sessions can be reviewed" });
      }
      
      // Check if user was a participant in the session
      if (session.teacherId !== reviewerId && session.studentId !== reviewerId) {
        return res.status(403).json({ message: "Only participants can review a session" });
      }
      
      // Create review
      const result = insertReviewSchema.safeParse({ 
        ...req.body, 
        sessionId, 
        reviewerId 
      });
      
      if (!result.success) {
        return res.status(400).json({ errors: result.error.format() });
      }
      
      const review = await storage.createReview(result.data);
      res.status(201).json(review);
    } catch (error) {
      next(error);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
