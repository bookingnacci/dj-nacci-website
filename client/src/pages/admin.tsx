import { useState, useRef } from "react";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Image as ImageIcon, Video, Trash2, Link as LinkIcon, Settings, LayoutGrid, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSettings, MediaItem } from "@/contexts/SettingsContext";

export default function Admin() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("settings"); // Start on settings based on user request
  
  const { 
    heroMedia, heroDuration, aboutMedia, aboutDuration,
    updateHeroMedia, updateHeroDuration, updateAboutMedia, updateAboutDuration 
  } = useSettings();

  // Mock data for the gallery
  const [mediaItems, setMediaItems] = useState([
    { id: 1, type: "image", url: "https://images.unsplash.com/photo-1598387181032-a3103a2db5b3", title: "Live at Paris" },
    { id: 2, type: "video", url: "https://youtube.com/watch?v=mock", title: "Ibiza Summer Mix" },
    { id: 3, type: "image", url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7", title: "Studio Sessions" }
  ]);

  const heroFileInputRef = useRef<HTMLInputElement>(null);
  const aboutFileInputRef = useRef<HTMLInputElement>(null);

  const handleDelete = (id: number) => {
    setMediaItems(mediaItems.filter(item => item.id !== id));
    toast({
      title: "Media Removed",
      description: "The item has been removed from your gallery.",
    });
  };

  const handleUploadClick = () => {
    toast({
      title: "Upload Triggered",
      description: "In a real app, this would open the file picker.",
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, section: 'hero' | 'about') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      const isVideo = file.type.startsWith('video/');
      const newItem: MediaItem = { id: Date.now().toString(), type: isVideo ? 'video' : 'image', url };
      
      if (section === 'hero') {
        updateHeroMedia([...heroMedia, newItem]);
        toast({ title: "Hero Media Added", description: "Image/Video successfully added to Hero section." });
      } else {
        updateAboutMedia([...aboutMedia, newItem]);
        toast({ title: "About Media Added", description: "Image/Video successfully added to About section." });
      }
    }
  };

  const removeMedia = (id: string, section: 'hero' | 'about') => {
    if (section === 'hero') {
      updateHeroMedia(heroMedia.filter(m => m.id !== id));
    } else {
      updateAboutMedia(aboutMedia.filter(m => m.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <div className="grain-overlay"></div>
      <Navbar />

      <div className="pt-32 pb-12 px-6 container mx-auto flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0 space-y-2">
          <div className="mb-8 px-4">
            <h1 className="font-serif text-2xl font-bold uppercase tracking-widest text-primary text-glow">Admin</h1>
            <p className="text-muted-foreground text-xs uppercase tracking-widest mt-1">Nacci Management</p>
          </div>
          
          <button 
            onClick={() => setActiveTab("gallery")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left uppercase tracking-widest text-sm transition-colors ${activeTab === "gallery" ? "bg-primary/10 text-primary border-l-2 border-primary" : "text-muted-foreground hover:bg-card hover:text-white"}`}
          >
            <LayoutGrid size={18} />
            Gallery
          </button>
          
          <button 
            onClick={() => setActiveTab("socials")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left uppercase tracking-widest text-sm transition-colors ${activeTab === "socials" ? "bg-primary/10 text-primary border-l-2 border-primary" : "text-muted-foreground hover:bg-card hover:text-white"}`}
          >
            <LinkIcon size={18} />
            Social Links
          </button>
          
          <button 
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left uppercase tracking-widest text-sm transition-colors ${activeTab === "settings" ? "bg-primary/10 text-primary border-l-2 border-primary" : "text-muted-foreground hover:bg-card hover:text-white"}`}
          >
            <Settings size={18} />
            Site Settings
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 glass-panel p-8 min-h-[600px] border-t-2 border-t-primary/30">
          
          {activeTab === "gallery" && (
            <div className="space-y-8 animate-in fade-in">
              <div className="flex justify-between items-center border-b border-border/20 pb-4">
                <h2 className="font-serif text-2xl uppercase tracking-widest">Media Gallery</h2>
                <div className="flex gap-4">
                  <Button onClick={handleUploadClick} variant="outline" className="rounded-none border-primary/50 text-primary hover:bg-primary hover:text-black uppercase text-xs tracking-widest h-10">
                    <ImageIcon className="mr-2" size={16} /> Upload Photo
                  </Button>
                  <Button variant="outline" className="rounded-none border-primary/50 text-primary hover:bg-primary hover:text-black uppercase text-xs tracking-widest h-10">
                    <Video className="mr-2" size={16} /> Add YouTube Link
                  </Button>
                </div>
              </div>

              {/* Gallery Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mediaItems.map((item) => (
                  <div key={item.id} className="group relative aspect-video bg-card border border-border/10 overflow-hidden">
                    {item.type === "image" ? (
                      <img src={item.url} alt={item.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-black/80">
                        <Video size={48} className="text-primary/50" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-4">
                      <p className="font-serif tracking-widest uppercase text-sm">{item.title}</p>
                      <p className="text-xs text-primary uppercase tracking-widest">{item.type}</p>
                    </div>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="absolute top-2 right-2 p-2 bg-destructive/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-destructive"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "socials" && (
            <div className="space-y-8 animate-in fade-in">
              <div className="border-b border-border/20 pb-4">
                <h2 className="font-serif text-2xl uppercase tracking-widest">Social Links</h2>
              </div>

              <div className="space-y-6 max-w-2xl">
                <div className="space-y-2">
                  <label className="uppercase tracking-widest text-xs text-primary">Instagram URL</label>
                  <Input defaultValue="https://instagram.com/djnacci" className="bg-black/50 border-border/30 rounded-none h-12" />
                </div>
                <div className="space-y-2">
                  <label className="uppercase tracking-widest text-xs text-primary">TikTok URL</label>
                  <Input defaultValue="https://tiktok.com/@djnacci" className="bg-black/50 border-border/30 rounded-none h-12" />
                </div>
                <Button className="rounded-none bg-primary text-black hover:bg-white uppercase tracking-widest h-12 px-8 mt-4">
                  Save Changes
                </Button>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-12 animate-in fade-in">
              
              {/* HERO SETTINGS */}
              <div className="space-y-6">
                <div className="border-b border-border/20 pb-4 flex justify-between items-end">
                  <div>
                    <h2 className="font-serif text-2xl uppercase tracking-widest text-glow text-primary">Hero Section Media</h2>
                    <p className="text-muted-foreground text-sm mt-1">Manage the background visual for the top of the homepage</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <label className="text-xs uppercase tracking-widest text-muted-foreground">Duration (sec):</label>
                      <Input 
                        type="number" 
                        value={heroDuration} 
                        onChange={(e) => updateHeroDuration(Number(e.target.value))}
                        className="w-20 bg-black/50 border-border/30 rounded-none h-10 text-center" 
                        min="1"
                      />
                    </div>
                    <Button 
                      onClick={() => heroFileInputRef.current?.click()}
                      className="rounded-none bg-primary/20 text-primary border border-primary hover:bg-primary hover:text-black uppercase text-xs tracking-widest h-10"
                    >
                      <Upload className="mr-2" size={16} /> Upload Device
                    </Button>
                    <input 
                      type="file" 
                      ref={heroFileInputRef} 
                      className="hidden" 
                      accept="image/*,video/*" 
                      onChange={(e) => handleFileUpload(e, 'hero')} 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {heroMedia.map((media) => (
                    <div key={media.id} className="group relative aspect-video bg-black border border-border/20 overflow-hidden">
                      {media.type === 'image' ? (
                        <img src={media.url} alt="Hero" className="w-full h-full object-cover" />
                      ) : (
                        <video src={media.url} className="w-full h-full object-cover" muted />
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                          onClick={() => removeMedia(media.id, 'hero')}
                          className="p-2 bg-destructive text-white rounded-full hover:bg-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="absolute bottom-2 left-2 text-[10px] bg-black/80 px-2 py-1 uppercase text-primary border border-primary/30">
                        {media.type}
                      </div>
                    </div>
                  ))}
                  {heroMedia.length === 0 && (
                    <div className="aspect-video bg-black/50 border border-dashed border-border/30 flex items-center justify-center text-muted-foreground text-sm uppercase">
                      No Media
                    </div>
                  )}
                </div>
              </div>

              {/* ABOUT SETTINGS */}
              <div className="space-y-6">
                <div className="border-b border-border/20 pb-4 flex justify-between items-end">
                  <div>
                    <h2 className="font-serif text-2xl uppercase tracking-widest text-glow text-primary">About Section Media</h2>
                    <p className="text-muted-foreground text-sm mt-1">Manage the visual for "The Artist" section</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <label className="text-xs uppercase tracking-widest text-muted-foreground">Duration (sec):</label>
                      <Input 
                        type="number" 
                        value={aboutDuration} 
                        onChange={(e) => updateAboutDuration(Number(e.target.value))}
                        className="w-20 bg-black/50 border-border/30 rounded-none h-10 text-center" 
                        min="1"
                      />
                    </div>
                    <Button 
                      onClick={() => aboutFileInputRef.current?.click()}
                      className="rounded-none bg-primary/20 text-primary border border-primary hover:bg-primary hover:text-black uppercase text-xs tracking-widest h-10"
                    >
                      <Upload className="mr-2" size={16} /> Upload Device
                    </Button>
                    <input 
                      type="file" 
                      ref={aboutFileInputRef} 
                      className="hidden" 
                      accept="image/*,video/*" 
                      onChange={(e) => handleFileUpload(e, 'about')} 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {aboutMedia.map((media) => (
                    <div key={media.id} className="group relative aspect-[3/4] bg-black border border-border/20 overflow-hidden">
                      {media.type === 'image' ? (
                        <img src={media.url} alt="About" className="w-full h-full object-cover" />
                      ) : (
                        <video src={media.url} className="w-full h-full object-cover" muted />
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                          onClick={() => removeMedia(media.id, 'about')}
                          className="p-2 bg-destructive text-white rounded-full hover:bg-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="absolute bottom-2 left-2 text-[10px] bg-black/80 px-2 py-1 uppercase text-primary border border-primary/30">
                        {media.type}
                      </div>
                    </div>
                  ))}
                  {aboutMedia.length === 0 && (
                    <div className="aspect-[3/4] bg-black/50 border border-dashed border-border/30 flex items-center justify-center text-muted-foreground text-sm uppercase">
                      No Media
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}