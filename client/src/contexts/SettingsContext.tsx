import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

export type MediaItem = {
  id: string;
  section: string;
  type: string;
  url: string;
  title?: string | null;
  duration: number;
  videoStartTime?: number | null;
  videoEndTime?: number | null;
  position: number;
};

export type SocialLinks = {
  instagram: string;
  tiktok: string;
  youtube: string;
  threads: string;
};

export type BookingRequest = {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  eventType: string;
  details: string;
  status: string;
  createdAt: string;
};

interface SettingsState {
  heroMedia: MediaItem[];
  aboutMedia: MediaItem[];
  galleryItems: MediaItem[];
  socialLinks: SocialLinks;
  bookingRequests: BookingRequest[];
  loading: boolean;

  refreshHeroMedia: () => Promise<void>;
  refreshAboutMedia: () => Promise<void>;
  refreshGallery: () => Promise<void>;
  refreshSocialLinks: () => Promise<void>;
  refreshBookings: () => Promise<void>;

  uploadMedia: (section: string, files: File[]) => Promise<void>;
  addYoutubeToGallery: (url: string, title: string) => Promise<void>;
  updateMediaItem: (id: string, updates: Partial<MediaItem>) => Promise<void>;
  deleteMediaItem: (id: string, section: string) => Promise<void>;
  reorderMedia: (section: string, ids: string[]) => Promise<void>;

  updateSocialLinks: (links: SocialLinks) => Promise<void>;

  addBookingRequest: (request: Omit<BookingRequest, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  markBookingReviewed: (id: string) => Promise<void>;
  deleteBooking: (id: string) => Promise<void>;
}

const SettingsContext = createContext<SettingsState | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [heroMedia, setHeroMedia] = useState<MediaItem[]>([]);
  const [aboutMedia, setAboutMedia] = useState<MediaItem[]>([]);
  const [galleryItems, setGalleryItems] = useState<MediaItem[]>([]);
  const [socialLinksState, setSocialLinksState] = useState<SocialLinks>({
    instagram: "", tiktok: "", youtube: "", threads: ""
  });
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshHeroMedia = useCallback(async () => {
    const res = await fetch("/api/media/hero");
    setHeroMedia(await res.json());
  }, []);

  const refreshAboutMedia = useCallback(async () => {
    const res = await fetch("/api/media/about");
    setAboutMedia(await res.json());
  }, []);

  const refreshGallery = useCallback(async () => {
    const res = await fetch("/api/media/gallery");
    setGalleryItems(await res.json());
  }, []);

  const refreshSocialLinks = useCallback(async () => {
    const res = await fetch("/api/social-links");
    const links: { platform: string; url: string }[] = await res.json();
    const mapped: SocialLinks = { instagram: "", tiktok: "", youtube: "", threads: "" };
    links.forEach(l => {
      if (l.platform in mapped) (mapped as any)[l.platform] = l.url;
    });
    setSocialLinksState(mapped);
  }, []);

  const refreshBookings = useCallback(async () => {
    const res = await fetch("/api/booking-requests");
    setBookingRequests(await res.json());
  }, []);

  useEffect(() => {
    Promise.all([
      refreshHeroMedia(),
      refreshAboutMedia(),
      refreshGallery(),
      refreshSocialLinks(),
      refreshBookings()
    ]).finally(() => setLoading(false));
  }, [refreshHeroMedia, refreshAboutMedia, refreshGallery, refreshSocialLinks, refreshBookings]);

  const uploadMedia = async (section: string, files: File[]) => {
    const formData = new FormData();
    formData.append("section", section);
    files.forEach(f => formData.append("files", f));
    await fetch("/api/media/upload", { method: "POST", body: formData });
    if (section === "hero") await refreshHeroMedia();
    else if (section === "about") await refreshAboutMedia();
    else await refreshGallery();
  };

  const addYoutubeToGallery = async (url: string, title: string) => {
    let videoId = "";
    if (url.includes("v=")) videoId = url.split("v=")[1].split("&")[0];
    else if (url.includes("youtu.be/")) videoId = url.split("youtu.be/")[1].split("?")[0];

    await fetch("/api/media", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        section: "gallery",
        type: "youtube",
        url: videoId ? `https://www.youtube.com/embed/${videoId}` : url,
        title: title || "YouTube Video",
        duration: 5,
        position: 0
      })
    });
    await refreshGallery();
  };

  const updateMediaItem = async (id: string, updates: Partial<MediaItem>) => {
    await fetch(`/api/media/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates)
    });
    await Promise.all([refreshHeroMedia(), refreshAboutMedia(), refreshGallery()]);
  };

  const deleteMediaItem = async (id: string, section: string) => {
    await fetch(`/api/media/${id}`, { method: "DELETE" });
    if (section === "hero") await refreshHeroMedia();
    else if (section === "about") await refreshAboutMedia();
    else await refreshGallery();
  };

  const reorderMedia = async (section: string, ids: string[]) => {
    await fetch("/api/media/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section, ids })
    });
    if (section === "hero") await refreshHeroMedia();
    else if (section === "about") await refreshAboutMedia();
    else await refreshGallery();
  };

  const updateSocialLinks = async (links: SocialLinks) => {
    for (const [platform, url] of Object.entries(links)) {
      await fetch("/api/social-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform, url })
      });
    }
    await refreshSocialLinks();
  };

  const addBookingRequest = async (request: Omit<BookingRequest, 'id' | 'createdAt' | 'status'>) => {
    await fetch("/api/booking-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request)
    });
    await refreshBookings();
  };

  const markBookingReviewed = async (id: string) => {
    await fetch(`/api/booking-requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "reviewed" })
    });
    await refreshBookings();
  };

  const deleteBooking = async (id: string) => {
    await fetch(`/api/booking-requests/${id}`, { method: "DELETE" });
    await refreshBookings();
  };

  return (
    <SettingsContext.Provider value={{
      heroMedia, aboutMedia, galleryItems, socialLinks: socialLinksState,
      bookingRequests, loading,
      refreshHeroMedia, refreshAboutMedia, refreshGallery, refreshSocialLinks, refreshBookings,
      uploadMedia, addYoutubeToGallery, updateMediaItem, deleteMediaItem, reorderMedia,
      updateSocialLinks, addBookingRequest, markBookingReviewed, deleteBooking
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings must be used within SettingsProvider");
  return context;
};