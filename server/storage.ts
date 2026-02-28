import { db } from "./db";
import { mediaItems, socialLinks, bookingRequests } from "@shared/schema";
import type { MediaItem, InsertMediaItem, SocialLink, InsertSocialLink, BookingRequest, InsertBookingRequest } from "@shared/schema";
import { eq, asc } from "drizzle-orm";

export interface IStorage {
  getMediaBySection(section: string): Promise<MediaItem[]>;
  getMediaItemById(id: string): Promise<MediaItem | undefined>;
  addMediaItem(item: InsertMediaItem): Promise<MediaItem>;
  updateMediaItem(id: string, updates: Partial<InsertMediaItem>): Promise<MediaItem | undefined>;
  deleteMediaItem(id: string): Promise<void>;
  reorderMedia(section: string, ids: string[]): Promise<void>;

  getSocialLinks(): Promise<SocialLink[]>;
  upsertSocialLink(link: InsertSocialLink): Promise<SocialLink>;

  getBookingRequests(): Promise<BookingRequest[]>;
  addBookingRequest(request: InsertBookingRequest): Promise<BookingRequest>;
  updateBookingStatus(id: string, status: string): Promise<BookingRequest | undefined>;
  deleteBookingRequest(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getMediaBySection(section: string): Promise<MediaItem[]> {
    return db.select().from(mediaItems).where(eq(mediaItems.section, section)).orderBy(asc(mediaItems.position));
  }

  async getMediaItemById(id: string): Promise<MediaItem | undefined> {
    const [item] = await db.select().from(mediaItems).where(eq(mediaItems.id, id));
    return item;
  }

  async addMediaItem(item: InsertMediaItem): Promise<MediaItem> {
    const existing = await this.getMediaBySection(item.section);
    const maxPosition = existing.length > 0 ? Math.max(...existing.map(m => m.position)) + 1 : 0;
    const [created] = await db.insert(mediaItems).values({ ...item, position: item.position ?? maxPosition }).returning();
    return created;
  }

  async updateMediaItem(id: string, updates: Partial<InsertMediaItem>): Promise<MediaItem | undefined> {
    const [updated] = await db.update(mediaItems).set(updates).where(eq(mediaItems.id, id)).returning();
    return updated;
  }

  async deleteMediaItem(id: string): Promise<void> {
    await db.delete(mediaItems).where(eq(mediaItems.id, id));
  }

  async reorderMedia(section: string, ids: string[]): Promise<void> {
    for (let i = 0; i < ids.length; i++) {
      await db.update(mediaItems).set({ position: i }).where(eq(mediaItems.id, ids[i]));
    }
  }

  async getSocialLinks(): Promise<SocialLink[]> {
    return db.select().from(socialLinks);
  }

  async upsertSocialLink(link: InsertSocialLink): Promise<SocialLink> {
    const existing = await db.select().from(socialLinks).where(eq(socialLinks.platform, link.platform));
    if (existing.length > 0) {
      const [updated] = await db.update(socialLinks).set({ url: link.url }).where(eq(socialLinks.platform, link.platform)).returning();
      return updated;
    }
    const [created] = await db.insert(socialLinks).values(link).returning();
    return created;
  }

  async getBookingRequests(): Promise<BookingRequest[]> {
    return db.select().from(bookingRequests).orderBy(asc(bookingRequests.createdAt));
  }

  async addBookingRequest(request: InsertBookingRequest): Promise<BookingRequest> {
    const [created] = await db.insert(bookingRequests).values(request).returning();
    return created;
  }

  async updateBookingStatus(id: string, status: string): Promise<BookingRequest | undefined> {
    const [updated] = await db.update(bookingRequests).set({ status }).where(eq(bookingRequests.id, id)).returning();
    return updated;
  }

  async deleteBookingRequest(id: string): Promise<void> {
    await db.delete(bookingRequests).where(eq(bookingRequests.id, id));
  }
}

export const storage = new DatabaseStorage();