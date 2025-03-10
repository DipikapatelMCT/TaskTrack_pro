import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.ts";
import { teamController } from "./api/team.controller.ts";

export async function registerRoutes(app: Express): Promise<Server> {
  // Team Members
  app.get("/api/team-members", (req, res) => teamController.getAll(req, res));
  app.post("/api/team-members", (req, res) => teamController.create(req, res));
  app.patch("/api/team-members/:id", (req, res) => teamController.update(req, res));
  app.delete("/api/team-members/:id", (req, res) => teamController.delete(req, res));

  // Leads
  app.get("/api/leads", async (_req, res) => {
    const leads = await storage.getLeads();
    res.json(leads);
  });

  app.post("/api/leads", async (req, res) => {
    const lead = await storage.createLead(req.body);
    res.status(201).json(lead);
  });

  app.patch("/api/leads/:id", async (req, res) => {
    const lead = await storage.updateLead(parseInt(req.params.id), req.body);
    res.json(lead);
  });

  app.delete("/api/leads/:id", async (req, res) => {
    await storage.deleteLead(parseInt(req.params.id));
    res.sendStatus(204);
  });

  // Tasks
  app.get("/api/tasks", async (_req, res) => {
    const tasks = await storage.getTasks();
    res.json(tasks);
  });

  // Add GET endpoint for individual task
  app.get("/api/tasks/:id", async (req, res) => {
    try {
      const task = await storage.getTaskById(parseInt(req.params.id));
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      console.error("Error fetching task:", error);
      res.status(500).json({ message: "Failed to fetch task" });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    const task = await storage.createTask(req.body);
    res.status(201).json(task);
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    try {
      const task = await storage.updateTask(parseInt(req.params.id), req.body);
      res.json(task);
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(500).json({ message: "Failed to update task" });
    }
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    await storage.deleteTask(parseInt(req.params.id));
    res.sendStatus(204);
  });

  // Bids
  app.get("/api/bids", async (_req, res) => {
    try {
      console.log('Fetching all bids');
      const bids = await storage.getBids();
      console.log('Retrieved bids:', bids);
      res.json(bids);
    } catch (error) {
      console.error('Error fetching bids:', error);
      res.status(500).json({ message: "Failed to fetch bids" });
    }
  });

  app.post("/api/bids", async (req, res) => {
    try {
      console.log('Creating new bid with data:', req.body);
      const bid = await storage.createBid(req.body);
      console.log('Created bid:', bid);
      res.status(201).json(bid);
    } catch (error) {
      console.error('Error creating bid:', error);
      res.status(500).json({ message: "Failed to create bid" });
    }
  });

  app.patch("/api/bids/:id", async (req, res) => {
    try {
      const bid = await storage.updateBid(parseInt(req.params.id), req.body);
      res.json(bid);
    } catch (error) {
      console.error('Error updating bid:', error);
      res.status(500).json({ message: "Failed to update bid" });
    }
  });

  app.delete("/api/bids/:id", async (req, res) => {
    try {
      await storage.deleteBid(parseInt(req.params.id));
      res.sendStatus(204);
    } catch (error) {
      console.error('Error deleting bid:', error);
      res.status(500).json({ message: "Failed to delete bid" });
    }
  });

  // Outreach
  app.get("/api/outreach", async (_req, res) => {
    const outreach = await storage.getOutreach();
    res.json(outreach);
  });

  app.post("/api/outreach", async (req, res) => {
    const outreach = await storage.createOutreach(req.body);
    res.status(201).json(outreach);
  });

  app.patch("/api/outreach/:id", async (req, res) => {
    const outreach = await storage.updateOutreach(parseInt(req.params.id), req.body);
    res.json(outreach);
  });

  app.delete("/api/outreach/:id", async (req, res) => {
    await storage.deleteOutreach(parseInt(req.params.id));
    res.sendStatus(204);
  });

  const httpServer = createServer(app);
  return httpServer;
}