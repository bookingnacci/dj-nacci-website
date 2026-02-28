import React, { createContext, useState, useContext } from 'react';
import heroBg from "@/assets/images/hero-bg.png";
import djPortrait from "@/assets/images/dj-portrait.png";

export type MediaItem = {
  id: string;
  type: 'image' | 'video' | 'youtube';
  url: string;
  title?: string;
  duration: number; // For images
  videoStartTime?: number; // For videos
  videoEndTime?: number; // For videos
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
  status: 'new' | 'reviewed';
  createdAt: Date;
};

interface SettingsState {
  // Hero & About
  heroMedia: MediaItem[];
  aboutMedia: MediaItem[];
  updateHeroMedia: (media: MediaItem[]) => void;
  updateAboutMedia: (media: MediaItem[]) => void;
  
  // Gallery
  galleryItems: MediaItem[];
  addGalleryItem: (item: MediaItem) => void;
  removeGalleryItem: (id: string) => void;
  
  // Socials
  socialLinks: SocialLinks;
  updateSocialLinks: (links: SocialLinks) => void;
  
  // Bookings
  bookingRequests: BookingRequest[];
  addBookingRequest: (request: Omit<BookingRequest, 'id' | 'createdAt' | 'status'>) => void;
  markBookingReviewed: (id: string) => void;
  deleteBooking: (id: string) => void;
}

const SettingsContext = createContext<SettingsState | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  // Hero & About Settings
  const [heroMedia, setHeroMedia] = useState<MediaItem[]>([
    { id: '1', type: 'image', url: heroBg, duration: 5 }
  ]);
  
  const [aboutMedia, setAboutMedia] = useState<MediaItem[]>([
    { id: '1', type: 'image', url: djPortrait, duration: 5 }
  ]);

  // Gallery
  const [galleryItems, setGalleryItems] = useState<MediaItem[]>([
    { id: '101', type: 'image', url: 'https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?q=80&w=2000&auto=format&fit=crop', title: 'Live at Paris', duration: 5 },
    { id: '103', type: 'image', url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2000&auto=format&fit=crop', title: 'Studio Sessions', duration: 5 }
  ]);

  const addGalleryItem = (item: MediaItem) => setGalleryItems(prev => [item, ...prev]);
  const removeGalleryItem = (id: string) => setGalleryItems(prev => prev.filter(item => item.id !== id));

  // Social Links
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({
    instagram: "https://instagram.com/djnacci",
    tiktok: "https://tiktok.com/@djnacci",
    youtube: "https://youtube.com/c/djnacci",
    threads: "https://threads.net/@djnacci"
  });

  const updateSocialLinks = (links: SocialLinks) => setSocialLinks(links);

  // Booking Requests
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([
    {
      id: 'b1',
      name: 'Hï Ibiza',
      email: 'booking@hiibiza.com',
      phone: '+34 971 31 38 00',
      date: '2026-07-15',
      eventType: 'Club Night',
      details: 'Looking to book for a 3-hour afro house set in the main room. We are expecting a full house with our usual VIP setup. Please let us know technical requirements and availability.',
      status: 'new',
      createdAt: new Date()
    }
  ]);

  const addBookingRequest = (request: Omit<BookingRequest, 'id' | 'createdAt' | 'status'>) => {
    const newRequest: BookingRequest = {
      ...request,
      id: Math.random().toString(36).substr(2, 9),
      status: 'new',
      createdAt: new Date()
    };
    setBookingRequests(prev => [newRequest, ...prev]);
  };

  const markBookingReviewed = (id: string) => {
    setBookingRequests(prev => prev.map(req => req.id === id ? { ...req, status: 'reviewed' } : req));
  };
  
  const deleteBooking = (id: string) => {
    setBookingRequests(prev => prev.filter(req => req.id !== id));
  };

  return (
    <SettingsContext.Provider value={{
      heroMedia, aboutMedia,
      updateHeroMedia: setHeroMedia,
      updateAboutMedia: setAboutMedia,
      galleryItems, addGalleryItem, removeGalleryItem,
      socialLinks, updateSocialLinks,
      bookingRequests, addBookingRequest, markBookingReviewed, deleteBooking
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