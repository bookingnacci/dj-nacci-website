import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import sharp from "sharp";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

async function processImage(buffer: Buffer, mimetype: string): Promise<{ data: Buffer; mime: string }> {
  const unsupportedFormats = ["image/heic", "image/heif", "image/webp", "image/tiff", "image/avif"];
  if (unsupportedFormats.includes(mimetype.toLowerCase())) {
    const converted = await sharp(buffer).jpeg({ quality: 90 }).toBuffer();
    return { data: converted, mime: "image/jpeg" };
  }
  return { data: buffer, mime: mimetype };
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get("/api/media/file/:id", async (req, res) => {
    try {
      const item = await storage.getMediaItemById(req.params.id);
      if (!item || !item.fileData || !item.mimeType) {
        return res.status(404).json({ message: "File not found" });
      }
      const buffer = Buffer.from(item.fileData, "base64");
      res.set("Content-Type", item.mimeType);
      res.set("Content-Length", String(buffer.length));
      res.set("Cache-Control", "public, max-age=31536000, immutable");
      res.send(buffer);
    } catch (err) {
      console.error("Error serving file:", err);
      res.status(500).json({ message: "Error serving file" });
    }
  });

  app.get("/api/media/:section", async (req, res) => {
    try {
      const items = await storage.getMediaBySection(req.params.section);
      const clean = items.map(({ fileData, ...rest }) => rest);
      res.json(clean);
    } catch (err) {
      console.error("Error fetching media:", err);
      res.json([]);
    }
  });

  app.post("/api/media/upload", upload.array("files", 20), async (req, res) => {
    try {
      const section = req.body.section;
      if (!section) return res.status(400).json({ message: "section is required" });

      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) return res.status(400).json({ message: "No files uploaded" });

      const results = [];
      for (const file of files) {
        const isVideo = file.mimetype.startsWith("video/");

        let finalBuffer = file.buffer;
        let finalMime = file.mimetype;

        if (!isVideo) {
          const processed = await processImage(file.buffer, file.mimetype);
          finalBuffer = processed.data;
          finalMime = processed.mime;
        }

        const base64Data = finalBuffer.toString("base64");

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
          mimeType: finalMime,
        });

        const updatedItem = await storage.updateMediaItem(item.id, {
          url: `/api/media/file/${item.id}`,
        });

        const { fileData, ...clean } = updatedItem || item;
        results.push(clean);
      }
      res.json(results);
    } catch (err) {
      console.error("Error uploading:", err);
      res.status(500).json({ message: "Upload failed" });
    }
  });

  app.post("/api/media", async (req, res) => {
    try {
      const item = await storage.addMediaItem(req.body);
      const { fileData, ...clean } = item;
      res.json(clean);
    } catch (err) {
      console.error("Error adding media:", err);
      res.status(500).json({ message: "Failed to add media" });
    }
  });

  app.patch("/api/media/:id", async (req, res) => {
    try {
      const updated = await storage.updateMediaItem(req.params.id, req.body);
      if (!updated) return res.status(404).json({ message: "Not found" });
      const { fileData, ...clean } = updated;
      res.json(clean);
    } catch (err) {
      console.error("Error updating media:", err);
      res.status(500).json({ message: "Failed to update" });
    }
  });

  app.delete("/api/media/:id", async (req, res) => {
    try {
      await storage.deleteMediaItem(req.params.id);
      res.json({ success: true });
    } catch (err) {
      console.error("Error deleting:", err);
      res.status(500).json({ message: "Failed to delete" });
    }
  });

  app.post("/api/media/reorder", async (req, res) => {
    try {
      const { section, ids } = req.body;
      if (!section || !ids) return res.status(400).json({ message: "section and ids required" });
      await storage.reorderMedia(section, ids);
      res.json({ success: true });
    } catch (err) {
      console.error("Error reordering:", err);
      res.status(500).json({ message: "Failed to reorder" });
    }
  });

  app.get("/api/social-links", async (_req, res) => {
    try {
      const links = await storage.getSocialLinks();
      res.json(links);
    } catch (err) {
      console.error("Error fetching social links:", err);
      res.json([]);
    }
  });

  app.post("/api/social-links", async (req, res) => {
    try {
      const link = await storage.upsertSocialLink(req.body);
      res.json(link);
    } catch (err) {
      console.error("Error saving social link:", err);
      res.status(500).json({ message: "Failed to save" });
    }
  });

  app.get("/api/booking-requests", async (_req, res) => {
    try {
      const requests = await storage.getBookingRequests();
      res.json(requests);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      res.json([]);
    }
  });

  app.post("/api/booking-requests", async (req, res) => {
    try {
      const request = await storage.addBookingRequest(req.body);
      res.json(request);
    } catch (err) {
      console.error("Error creating booking:", err);
      res.status(500).json({ message: "Failed to create booking" });
    }
  });

  app.patch("/api/booking-requests/:id", async (req, res) => {
    try {
      const updated = await storage.updateBookingStatus(req.params.id, req.body.status);
      if (!updated) return res.status(404).json({ message: "Not found" });
      res.json(updated);
    } catch (err) {
      console.error("Error updating booking:", err);
      res.status(500).json({ message: "Failed to update" });
    }
  });

  app.delete("/api/booking-requests/:id", async (req, res) => {
    try {
      await storage.deleteBookingRequest(req.params.id);
      res.json({ success: true });
    } catch (err) {
      console.error("Error deleting booking:", err);
      res.status(500).json({ message: "Failed to delete" });
    }
  });

  return httpServer;
}
