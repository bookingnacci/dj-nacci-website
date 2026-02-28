import React, { createContext, useState, useContext } from 'react';
import heroBg from "@/assets/images/hero-bg.png";
import djPortrait from "@/assets/images/dj-portrait.png";

export type MediaItem = {
  id: string;
  type: 'image' | 'video';
  url: string;
};

interface SettingsState {
  heroMedia: MediaItem[];
  heroDuration: number;
  aboutMedia: MediaItem[];
  aboutDuration: number;
  updateHeroMedia: (media: MediaItem[]) => void;
  updateHeroDuration: (duration: number) => void;
  updateAboutMedia: (media: MediaItem[]) => void;
  updateAboutDuration: (duration: number) => void;
}

const SettingsContext = createContext<SettingsState | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [heroMedia, setHeroMedia] = useState<MediaItem[]>([
    { id: '1', type: 'image', url: heroBg }
  ]);
  const [heroDuration, setHeroDuration] = useState(5);
  
  const [aboutMedia, setAboutMedia] = useState<MediaItem[]>([
    { id: '1', type: 'image', url: djPortrait }
  ]);
  const [aboutDuration, setAboutDuration] = useState(5);

  return (
    <SettingsContext.Provider value={{
      heroMedia, heroDuration, aboutMedia, aboutDuration,
      updateHeroMedia: setHeroMedia, updateHeroDuration: setHeroDuration,
      updateAboutMedia: setAboutMedia, updateAboutDuration: setAboutDuration
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