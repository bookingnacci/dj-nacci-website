import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const fileStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: fileStorage });

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.use("/uploads", (await import("express")).default.static(uploadsDir));

  app.get("/api/media/:section", async (req, res) => {
    const items = await storage.getMediaBySection(req.params.section);
    res.json(items);
  });

  app.post("/api/media/upload", upload.array("files", 20), async (req, res) => {
    const section = req.body.section;
    if (!section) return res.status(400).json({ message: "section is required" });

    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) return res.status(400).json({ message: "No files uploaded" });

    const results = [];
    for (const file of files) {
      const isVideo = file.mimetype.startsWith("video/");
      const item = await storage.addMediaItem({
        section,
        type: isVideo ? "video" : "image",
        url: `/uploads/${file.filename}`,
        title: file.originalname,
        duration: 5,
        videoStartTime: 0,
        videoEndTime: 15,
        position: 0,
      });
      results.push(item);
    }
    res.json(results);
  });

  app.post("/api/media", async (req, res) => {
    const item = await storage.addMediaItem(req.body);
    res.json(item);
  });

  app.patch("/api/media/:id", async (req, res) => {
    const updated = await storage.updateMediaItem(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  });

  app.delete("/api/media/:id", async (req, res) => {
    await storage.deleteMediaItem(req.params.id);
    res.json({ success: true });
  });

  app.post("/api/media/reorder", async (req, res) => {
    const { section, ids } = req.body;
    if (!section || !ids) return res.status(400).json({ message: "section and ids required" });
    await storage.reorderMedia(section, ids);
    res.json({ success: true });
  });

  app.get("/api/social-links", async (_req, res) => {
    const links = await storage.getSocialLinks();
    res.json(links);
  });

  app.post("/api/social-links", async (req, res) => {
    const link = await storage.upsertSocialLink(req.body);
    res.json(link);
  });

  app.get("/api/booking-requests", async (_req, res) => {
    const requests = await storage.getBookingRequests();
    res.json(requests);
  });

  app.post("/api/booking-requests", async (req, res) => {
    const request = await storage.addBookingRequest(req.body);
    res.json(request);
  });

  app.patch("/api/booking-requests/:id", async (req, res) => {
    const updated = await storage.updateBookingStatus(req.params.id, req.body.status);
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  });

  app.delete("/api/booking-requests/:id", async (req, res) => {
    await storage.deleteBookingRequest(req.params.id);
    res.json({ success: true });
  });

  return httpServer;
}