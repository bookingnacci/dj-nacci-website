import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get("/api/media/file/:id", async (req, res) => {
    const item = await storage.getMediaItemById(req.params.id);
    if (!item || !item.fileData || !item.mimeType) {
      return res.status(404).json({ message: "File not found" });
    }
    const buffer = Buffer.from(item.fileData, "base64");
    res.set("Content-Type", item.mimeType);
    res.set("Content-Length", String(buffer.length));
    res.set("Cache-Control", "public, max-age=31536000, immutable");
    res.send(buffer);
  });

  app.get("/api/media/:section", async (req, res) => {
    const items = await storage.getMediaBySection(req.params.section);
    const clean = items.map(({ fileData, ...rest }) => rest);
    res.json(clean);
  });

  app.post("/api/media/upload", upload.array("files", 20), async (req, res) => {
    const section = req.body.section;
    if (!section) return res.status(400).json({ message: "section is required" });

    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) return res.status(400).json({ message: "No files uploaded" });

    const results = [];
    for (const file of files) {
      const isVideo = file.mimetype.startsWith("video/");
      const base64Data = file.buffer.toString("base64");

      const item = await storage.addMediaItem({
        section,
        type: isVideo ? "video" : "image",
        url: "placeholder",
        title: file.originalname,
        duration: 5,
        videoStartTime: 0,
        videoEndTime: 15,
        position: 0,
        fileData: base64Data,
        mimeType: file.mimetype,
      });

      const updatedItem = await storage.updateMediaItem(item.id, {
        url: `/api/media/file/${item.id}`,
      });

      const { fileData, ...clean } = updatedItem || item;
      results.push(clean);
    }
    res.json(results);
  });

  app.post("/api/media", async (req, res) => {
    const item = await storage.addMediaItem(req.body);
    const { fileData, ...clean } = item;
    res.json(clean);
  });

  app.patch("/api/media/:id", async (req, res) => {
    const updated = await storage.updateMediaItem(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: "Not found" });
    const { fileData, ...clean } = updated;
    res.json(clean);
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
