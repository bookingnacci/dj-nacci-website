import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Image as ImageIcon, Video, Trash2, Link as LinkIcon, Settings, LayoutGrid } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Admin() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("gallery");
  
  // Mock data for the gallery
  const [mediaItems, setMediaItems] = useState([
    { id: 1, type: "image", url: "https://images.unsplash.com/photo-1598387181032-a3103a2db5b3", title: "Live at Paris" },
    { id: 2, type: "video", url: "https://youtube.com/watch?v=mock", title: "Ibiza Summer Mix" },
    { id: 3, type: "image", url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7", title: "Studio Sessions" }
  ]);

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

              {/* Add Link Form (Mock) */}
              <div className="bg-background/50 p-6 border border-border/20 space-y-4">
                <h3 className="uppercase tracking-widest text-sm text-primary">Add New YouTube Video</h3>
                <div className="flex gap-4">
                  <Input placeholder="Paste YouTube URL here..." className="bg-black/50 border-border/30 rounded-none focus-visible:ring-primary" />
                  <Input placeholder="Video Title" className="bg-black/50 border-border/30 rounded-none focus-visible:ring-primary w-1/3" />
                  <Button className="rounded-none bg-primary text-black hover:bg-white uppercase tracking-widest">Add</Button>
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
                <p className="text-muted-foreground text-sm uppercase tracking-widest mt-2">Manage links displayed on the home page</p>
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
                <div className="space-y-2">
                  <label className="uppercase tracking-widest text-xs text-primary">YouTube Channel URL</label>
                  <Input defaultValue="https://youtube.com/c/djnacci" className="bg-black/50 border-border/30 rounded-none h-12" />
                </div>
                <Button className="rounded-none bg-primary text-black hover:bg-white uppercase tracking-widest h-12 px-8 mt-4">
                  Save Changes
                </Button>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="flex items-center justify-center h-[400px] animate-in fade-in">
              <p className="text-muted-foreground uppercase tracking-widest text-sm">Additional settings coming soon.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}