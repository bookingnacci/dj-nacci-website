import { useState, useRef } from "react";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Image as ImageIcon, Video, Trash2, Link as LinkIcon, 
  Settings, LayoutGrid, Upload, Inbox, Check, Youtube, Phone,
  ChevronLeft, ChevronRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSettings, MediaItem, SocialLinks } from "@/contexts/SettingsContext";

export default function Admin() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("settings");
  
  const { 
    heroMedia, aboutMedia,
    updateHeroMedia, updateAboutMedia,
    galleryItems, addGalleryItem, removeGalleryItem,
    socialLinks, updateSocialLinks,
    bookingRequests, markBookingReviewed, deleteBooking
  } = useSettings();

  const heroFileInputRef = useRef<HTMLInputElement>(null);
  const aboutFileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [youtubeTitle, setYoutubeTitle] = useState("");

  const [localSocials, setLocalSocials] = useState<SocialLinks>(socialLinks);

  // File Upload Handlers (Supports Multiple)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, section: 'hero' | 'about' | 'gallery') => {
    if (e.target.files && e.target.files.length > 0) {
      const newItems: MediaItem[] = Array.from(e.target.files).map(file => {
        const url = URL.createObjectURL(file);
        const isVideo = file.type.startsWith('video/');
        return { 
          id: Date.now().toString() + Math.random().toString(), 
          type: isVideo ? 'video' : 'image', 
          url,
          title: file.name,
          duration: 5,
          videoStartTime: 0,
          videoEndTime: 15
        };
      });
      
      if (section === 'hero') {
        updateHeroMedia([...heroMedia, ...newItems]);
        toast({ title: `${newItems.length} Hero Media Added` });
      } else if (section === 'about') {
        updateAboutMedia([...aboutMedia, ...newItems]);
        toast({ title: `${newItems.length} About Media Added` });
      } else if (section === 'gallery') {
        newItems.forEach(item => addGalleryItem(item));
        toast({ title: `${newItems.length} Added to Gallery` });
      }
    }
    // Reset input so the same files can be selected again if needed
    if (e.target) e.target.value = '';
  };

  const removeMedia = (id: string, section: 'hero' | 'about') => {
    if (section === 'hero') {
      updateHeroMedia(heroMedia.filter(m => m.id !== id));
    } else {
      updateAboutMedia(aboutMedia.filter(m => m.id !== id));
    }
  };

  const updateMediaItem = (id: string, section: 'hero' | 'about', updates: Partial<MediaItem>) => {
    if (section === 'hero') {
      updateHeroMedia(heroMedia.map(m => m.id === id ? { ...m, ...updates } : m));
    } else {
      updateAboutMedia(aboutMedia.map(m => m.id === id ? { ...m, ...updates } : m));
    }
  };

  const moveMedia = (section: 'hero' | 'about', index: number, direction: 'left' | 'right') => {
    const mediaList = section === 'hero' ? [...heroMedia] : [...aboutMedia];
    const updateFn = section === 'hero' ? updateHeroMedia : updateAboutMedia;
    
    if (direction === 'left' && index > 0) {
      const temp = mediaList[index];
      mediaList[index] = mediaList[index - 1];
      mediaList[index - 1] = temp;
      updateFn(mediaList);
    } else if (direction === 'right' && index < mediaList.length - 1) {
      const temp = mediaList[index];
      mediaList[index] = mediaList[index + 1];
      mediaList[index + 1] = temp;
      updateFn(mediaList);
    }
  };

  const handleAddYoutube = () => {
    if (!youtubeUrl) return;
    
    let videoId = "";
    if (youtubeUrl.includes("v=")) {
      videoId = youtubeUrl.split("v=")[1].split("&")[0];
    } else if (youtubeUrl.includes("youtu.be/")) {
      videoId = youtubeUrl.split("youtu.be/")[1].split("?")[0];
    }

    addGalleryItem({
      id: Date.now().toString(),
      type: 'youtube',
      url: videoId ? `https://www.youtube.com/embed/${videoId}` : youtubeUrl,
      title: youtubeTitle || "YouTube Video",
      duration: 5
    });
    
    setYoutubeUrl("");
    setYoutubeTitle("");
    toast({ title: "YouTube Video Added" });
  };

  const handleSaveSocials = () => {
    updateSocialLinks(localSocials);
    toast({ title: "Social Links Updated", description: "Changes are now live on the site." });
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
            onClick={() => setActiveTab("requests")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left uppercase tracking-widest text-sm transition-colors justify-between ${activeTab === "requests" ? "bg-primary/10 text-primary border-l-2 border-primary" : "text-muted-foreground hover:bg-card hover:text-white"}`}
          >
            <div className="flex items-center gap-3">
              <Inbox size={18} />
              Bookings
            </div>
            {bookingRequests.filter(r => r.status === 'new').length > 0 && (
              <span className="bg-primary text-black text-[10px] px-2 py-0.5 rounded-full font-bold">
                {bookingRequests.filter(r => r.status === 'new').length}
              </span>
            )}
          </button>

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
          
          {activeTab === "requests" && (
            <div className="space-y-8 animate-in fade-in">
              <div className="border-b border-border/20 pb-4">
                <h2 className="font-serif text-2xl uppercase tracking-widest text-glow">Booking Requests</h2>
              </div>
              
              <div className="space-y-4">
                {bookingRequests.length === 0 ? (
                  <p className="text-muted-foreground text-center py-12 uppercase tracking-widest text-sm border border-dashed border-border/20">No booking requests yet.</p>
                ) : (
                  bookingRequests.map((req) => (
                    <div key={req.id} className={`p-6 border ${req.status === 'new' ? 'border-primary/50 bg-primary/5' : 'border-border/20 bg-background/30'} flex flex-col md:flex-row justify-between gap-6`}>
                      <div className="space-y-4 flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="font-serif text-xl font-bold uppercase">{req.name}</h3>
                              {req.status === 'new' && <span className="bg-primary text-black text-[10px] px-2 py-0.5 rounded-sm uppercase tracking-widest font-bold">New</span>}
                            </div>
                            <p className="text-primary text-sm tracking-widest">{req.email}</p>
                            <p className="text-muted-foreground text-xs mt-1 flex items-center gap-2">
                              <Phone size={12} /> {req.phone}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="uppercase tracking-widest text-sm font-bold">{new Date(req.date).toLocaleDateString()}</p>
                            <p className="text-muted-foreground text-xs uppercase tracking-widest mt-1">{req.eventType}</p>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-black/40 border border-border/10 text-sm text-muted-foreground leading-relaxed">
                          {req.details}
                        </div>
                      </div>
                      
                      <div className="flex md:flex-col gap-2 justify-end">
                        {req.status === 'new' && (
                          <Button onClick={() => markBookingReviewed(req.id)} className="rounded-none bg-primary text-black hover:bg-white uppercase tracking-widest text-xs h-10 w-full">
                            <Check className="mr-2" size={14} /> Mark Reviewed
                          </Button>
                        )}
                        <Button onClick={() => deleteBooking(req.id)} variant="outline" className="rounded-none border-destructive/50 text-destructive hover:bg-destructive hover:text-white uppercase tracking-widest text-xs h-10 w-full">
                          <Trash2 className="mr-2" size={14} /> Delete
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "gallery" && (
            <div className="space-y-8 animate-in fade-in">
              <div className="flex justify-between items-center border-b border-border/20 pb-4">
                <div>
                  <h2 className="font-serif text-2xl uppercase tracking-widest text-glow">Media Gallery</h2>
                  <p className="text-sm text-muted-foreground mt-1">Manage photos and videos shown on the website.</p>
                </div>
                <div className="flex gap-4">
                  <input 
                    type="file" 
                    multiple
                    ref={galleryFileInputRef} 
                    className="hidden" 
                    accept="image/*,video/*" 
                    onChange={(e) => handleFileUpload(e, 'gallery')} 
                  />
                  <Button 
                    onClick={() => galleryFileInputRef.current?.click()} 
                    variant="outline" 
                    className="rounded-none border-primary/50 text-primary hover:bg-primary hover:text-black uppercase text-xs tracking-widest h-10"
                  >
                    <Upload className="mr-2" size={16} /> Upload Media
                  </Button>
                </div>
              </div>

              {/* Add Link Form */}
              <div className="bg-background/30 p-6 border border-border/10 space-y-4">
                <h3 className="uppercase tracking-widest text-sm text-primary flex items-center gap-2">
                  <Youtube size={16} /> Add YouTube Link
                </h3>
                <div className="flex flex-col md:flex-row gap-4">
                  <Input 
                    placeholder="https://youtube.com/watch?v=..." 
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    className="bg-black/50 border-border/30 rounded-none focus-visible:ring-primary flex-1" 
                  />
                  <Input 
                    placeholder="Video Title" 
                    value={youtubeTitle}
                    onChange={(e) => setYoutubeTitle(e.target.value)}
                    className="bg-black/50 border-border/30 rounded-none focus-visible:ring-primary md:w-1/3" 
                  />
                  <Button 
                    onClick={handleAddYoutube}
                    className="rounded-none bg-primary text-black hover:bg-white uppercase tracking-widest"
                  >
                    Add
                  </Button>
                </div>
              </div>

              {/* Gallery Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryItems.map((item) => (
                  <div key={item.id} className="group relative aspect-video bg-black border border-border/20 overflow-hidden">
                    {item.type === "image" ? (
                      <img src={item.url} alt={item.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                    ) : item.type === "youtube" ? (
                      <div className="w-full h-full relative">
                        <iframe src={item.url} className="w-full h-full pointer-events-none" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors"></div>
                      </div>
                    ) : (
                      <video src={item.url} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" muted loop playsInline />
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-4 opacity-100 transition-opacity">
                      <p className="font-serif tracking-widest uppercase text-sm truncate">{item.title}</p>
                      <p className="text-xs text-primary uppercase tracking-widest">{item.type}</p>
                    </div>
                    
                    <button 
                      onClick={() => removeGalleryItem(item.id)}
                      className="absolute top-2 right-2 p-2 bg-destructive/90 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-destructive z-10"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                {galleryItems.length === 0 && (
                  <div className="col-span-full py-12 text-center text-muted-foreground uppercase tracking-widest text-sm border border-dashed border-border/20">
                    No media in gallery.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "socials" && (
            <div className="space-y-8 animate-in fade-in">
              <div className="border-b border-border/20 pb-4">
                <h2 className="font-serif text-2xl uppercase tracking-widest text-glow">Social Links</h2>
                <p className="text-muted-foreground text-sm mt-2">Manage links displayed on the home page.</p>
              </div>

              <div className="space-y-6 max-w-2xl">
                <div className="space-y-2">
                  <label className="uppercase tracking-widest text-xs text-primary">Instagram URL</label>
                  <Input 
                    value={localSocials.instagram} 
                    onChange={e => setLocalSocials({...localSocials, instagram: e.target.value})}
                    className="bg-black/50 border-border/30 rounded-none h-12 focus-visible:ring-primary focus-visible:border-primary" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="uppercase tracking-widest text-xs text-primary">TikTok URL</label>
                  <Input 
                    value={localSocials.tiktok} 
                    onChange={e => setLocalSocials({...localSocials, tiktok: e.target.value})}
                    className="bg-black/50 border-border/30 rounded-none h-12 focus-visible:ring-primary focus-visible:border-primary" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="uppercase tracking-widest text-xs text-primary">YouTube Channel URL</label>
                  <Input 
                    value={localSocials.youtube} 
                    onChange={e => setLocalSocials({...localSocials, youtube: e.target.value})}
                    className="bg-black/50 border-border/30 rounded-none h-12 focus-visible:ring-primary focus-visible:border-primary" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="uppercase tracking-widest text-xs text-primary">Threads URL</label>
                  <Input 
                    value={localSocials.threads} 
                    onChange={e => setLocalSocials({...localSocials, threads: e.target.value})}
                    className="bg-black/50 border-border/30 rounded-none h-12 focus-visible:ring-primary focus-visible:border-primary" 
                  />
                </div>
                <Button 
                  onClick={handleSaveSocials}
                  className="rounded-none bg-primary text-black hover:bg-white uppercase tracking-widest h-12 px-8 mt-4 transition-all duration-300"
                >
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
                    <Button 
                      onClick={() => heroFileInputRef.current?.click()}
                      className="rounded-none bg-primary/20 text-primary border border-primary hover:bg-primary hover:text-black uppercase text-xs tracking-widest h-10"
                    >
                      <Upload className="mr-2" size={16} /> Upload Multiple
                    </Button>
                    <input 
                      type="file" 
                      multiple
                      ref={heroFileInputRef} 
                      className="hidden" 
                      accept="image/*,video/*" 
                      onChange={(e) => handleFileUpload(e, 'hero')} 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {heroMedia.map((media, index) => (
                    <div key={media.id} className="group flex flex-col bg-card border border-border/20 overflow-hidden relative">
                      <div className="aspect-video bg-black relative">
                        {media.type === 'image' ? (
                          <img src={media.url} alt="Hero" className="w-full h-full object-cover" />
                        ) : (
                          <video src={media.url} className="w-full h-full object-cover" muted />
                        )}
                        <div className="absolute top-2 left-2 text-[10px] bg-black/80 px-2 py-1 uppercase text-primary border border-primary/30">
                          {media.type}
                        </div>
                        
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => moveMedia('hero', index, 'left')}
                            disabled={index === 0}
                            className="p-1.5 bg-black/80 text-white rounded-sm hover:bg-black hover:text-primary disabled:opacity-30 disabled:hover:text-white transition-colors"
                            title="Move Left"
                          >
                            <ChevronLeft size={14} />
                          </button>
                          <button 
                            onClick={() => moveMedia('hero', index, 'right')}
                            disabled={index === heroMedia.length - 1}
                            className="p-1.5 bg-black/80 text-white rounded-sm hover:bg-black hover:text-primary disabled:opacity-30 disabled:hover:text-white transition-colors"
                            title="Move Right"
                          >
                            <ChevronRight size={14} />
                          </button>
                        </div>

                        <button 
                          onClick={() => removeMedia(media.id, 'hero')}
                          className="absolute top-2 right-2 p-2 bg-destructive text-white rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      
                      <div className="p-4 bg-black/80 border-t border-border/20">
                        {media.type === 'image' ? (
                          <div className="flex items-center justify-between">
                            <label className="text-xs uppercase tracking-widest text-muted-foreground">Duration (sec):</label>
                            <Input 
                              type="number" 
                              value={media.duration} 
                              onChange={(e) => updateMediaItem(media.id, 'hero', { duration: Number(e.target.value) })}
                              className="w-20 bg-black border-border/30 rounded-none h-8 text-center text-xs" 
                              min="1"
                            />
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between gap-2">
                              <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Start (sec):</label>
                              <Input 
                                type="number" 
                                value={media.videoStartTime} 
                                onChange={(e) => updateMediaItem(media.id, 'hero', { videoStartTime: Number(e.target.value) })}
                                className="w-16 bg-black border-border/30 rounded-none h-8 text-center text-xs" 
                                min="0"
                              />
                            </div>
                            <div className="flex items-center justify-between gap-2">
                              <label className="text-[10px] uppercase tracking-widest text-muted-foreground">End (sec):</label>
                              <Input 
                                type="number" 
                                value={media.videoEndTime} 
                                onChange={(e) => updateMediaItem(media.id, 'hero', { videoEndTime: Number(e.target.value) })}
                                className="w-16 bg-black border-border/30 rounded-none h-8 text-center text-xs" 
                                min="1"
                              />
                            </div>
                            <div className="pt-2 border-t border-border/20 text-[10px] text-primary uppercase tracking-widest text-right">
                              Play Time: {Math.max(0, (media.videoEndTime || 0) - (media.videoStartTime || 0))}s
                            </div>
                          </div>
                        )}
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
                    <Button 
                      onClick={() => aboutFileInputRef.current?.click()}
                      className="rounded-none bg-primary/20 text-primary border border-primary hover:bg-primary hover:text-black uppercase text-xs tracking-widest h-10"
                    >
                      <Upload className="mr-2" size={16} /> Upload Multiple
                    </Button>
                    <input 
                      type="file" 
                      multiple
                      ref={aboutFileInputRef} 
                      className="hidden" 
                      accept="image/*,video/*" 
                      onChange={(e) => handleFileUpload(e, 'about')} 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {aboutMedia.map((media, index) => (
                    <div key={media.id} className="group flex flex-col bg-card border border-border/20 overflow-hidden relative">
                      <div className="aspect-[3/4] bg-black relative">
                        {media.type === 'image' ? (
                          <img src={media.url} alt="About" className="w-full h-full object-cover" />
                        ) : (
                          <video src={media.url} className="w-full h-full object-cover" muted />
                        )}
                        <div className="absolute top-2 left-2 text-[10px] bg-black/80 px-2 py-1 uppercase text-primary border border-primary/30">
                          {media.type}
                        </div>

                        <div className="absolute top-2 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => moveMedia('about', index, 'left')}
                            disabled={index === 0}
                            className="p-1.5 bg-black/80 text-white rounded-sm hover:bg-black hover:text-primary disabled:opacity-30 disabled:hover:text-white transition-colors"
                            title="Move Left"
                          >
                            <ChevronLeft size={14} />
                          </button>
                          <button 
                            onClick={() => moveMedia('about', index, 'right')}
                            disabled={index === aboutMedia.length - 1}
                            className="p-1.5 bg-black/80 text-white rounded-sm hover:bg-black hover:text-primary disabled:opacity-30 disabled:hover:text-white transition-colors"
                            title="Move Right"
                          >
                            <ChevronRight size={14} />
                          </button>
                        </div>

                        <button 
                          onClick={() => removeMedia(media.id, 'about')}
                          className="absolute top-2 right-2 p-2 bg-destructive text-white rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      
                      <div className="p-4 bg-black/80 border-t border-border/20">
                        {media.type === 'image' ? (
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Duration (sec):</label>
                            <Input 
                              type="number" 
                              value={media.duration} 
                              onChange={(e) => updateMediaItem(media.id, 'about', { duration: Number(e.target.value) })}
                              className="w-16 bg-black border-border/30 rounded-none h-8 text-center text-xs" 
                              min="1"
                            />
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between gap-2">
                              <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Start:</label>
                              <Input 
                                type="number" 
                                value={media.videoStartTime} 
                                onChange={(e) => updateMediaItem(media.id, 'about', { videoStartTime: Number(e.target.value) })}
                                className="w-12 bg-black border-border/30 rounded-none h-8 text-center text-xs px-1" 
                                min="0"
                              />
                            </div>
                            <div className="flex items-center justify-between gap-2">
                              <label className="text-[10px] uppercase tracking-widest text-muted-foreground">End:</label>
                              <Input 
                                type="number" 
                                value={media.videoEndTime} 
                                onChange={(e) => updateMediaItem(media.id, 'about', { videoEndTime: Number(e.target.value) })}
                                className="w-12 bg-black border-border/30 rounded-none h-8 text-center text-xs px-1" 
                                min="1"
                              />
                            </div>
                            <div className="pt-2 border-t border-border/20 text-[10px] text-primary uppercase tracking-widest text-right">
                              Play: {Math.max(0, (media.videoEndTime || 0) - (media.videoStartTime || 0))}s
                            </div>
                          </div>
                        )}
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