import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Instagram, Youtube } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";

// List of basic country codes for the select dropdown
const COUNTRY_CODES = [
  { code: "+33", label: "FR (+33)" },
  { code: "+1", label: "US/CA (+1)" },
  { code: "+44", label: "UK (+44)" },
  { code: "+49", label: "DE (+49)" },
  { code: "+34", label: "ES (+34)" },
  { code: "+39", label: "IT (+39)" },
  { code: "+216", label: "TN (+216)" },
  { code: "+971", label: "AE (+971)" }
];

// Thread icon custom SVG
const ThreadsIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
    <path d="M12 15.5C13.933 15.5 15.5 13.933 15.5 12C15.5 10.067 13.933 8.5 12 8.5C10.067 8.5 8.5 10.067 8.5 12C8.5 12.8028 8.77098 13.5422 9.22912 14.1332C10.2246 15.4172 12.1901 15.5 13.5 15.5H16.5" />
    <path d="M12 12V8.5" />
  </svg>
);

export default function Home() {
  const { toast } = useToast();
  const { 
    heroMedia, aboutMedia, 
    galleryItems, socialLinks, addBookingRequest 
  } = useSettings();

  const [bookingData, setBookingData] = useState({
    name: "",
    email: "",
    countryCode: "+33",
    phone: "",
    date: "",
    eventType: "",
    details: ""
  });

  const [heroIndex, setHeroIndex] = useState(0);
  const [aboutIndex, setAboutIndex] = useState(0);
  
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const aboutVideoRef = useRef<HTMLVideoElement>(null);

  // Calculate tomorrow's date for the minimum date picker constraint
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const activeHero = heroMedia[heroIndex] || null;
  const activeAbout = aboutMedia[aboutIndex] || null;

  // Hero Media Slideshow Logic
  useEffect(() => {
    if (heroMedia.length <= 1 || !activeHero) return;
    
    let durationMs = activeHero.duration * 1000;
    if (activeHero.type === 'video' && activeHero.videoEndTime !== undefined && activeHero.videoStartTime !== undefined) {
      durationMs = Math.max(1000, (activeHero.videoEndTime - activeHero.videoStartTime) * 1000);
    }

    const timer = setTimeout(() => {
      setHeroIndex(prev => (prev + 1) % heroMedia.length);
    }, durationMs);
    
    return () => clearTimeout(timer);
  }, [heroMedia, heroIndex, activeHero]);

  // About Media Slideshow Logic
  useEffect(() => {
    if (aboutMedia.length <= 1 || !activeAbout) return;
    
    let durationMs = activeAbout.duration * 1000;
    if (activeAbout.type === 'video' && activeAbout.videoEndTime !== undefined && activeAbout.videoStartTime !== undefined) {
      durationMs = Math.max(1000, (activeAbout.videoEndTime - activeAbout.videoStartTime) * 1000);
    }

    const timer = setTimeout(() => {
      setAboutIndex(prev => (prev + 1) % aboutMedia.length);
    }, durationMs);
    
    return () => clearTimeout(timer);
  }, [aboutMedia, aboutIndex, activeAbout]);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (bookingData.details.length < 200) {
      toast({
        title: "More Details Needed",
        description: "Please provide at least 200 characters in the event details section.",
        variant: "destructive",
      });
      return;
    }

    addBookingRequest({
      ...bookingData,
      phone: `${bookingData.countryCode} ${bookingData.phone}`
    });
    
    toast({
      title: "Booking Request Sent",
      description: "DJ Nacci's management will review your request.",
      variant: "default",
    });
    setBookingData({ name: "", email: "", countryCode: "+33", phone: "", date: "", eventType: "", details: "" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative selection:bg-primary/30">
      <div className="grain-overlay"></div>
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-black">
          {activeHero && (
            <div key={activeHero.id} className="absolute inset-0 animate-in fade-in duration-1000">
              {activeHero.type === 'video' ? (
                <video 
                  ref={heroVideoRef}
                  src={activeHero.url + (activeHero.videoStartTime !== undefined ? `#t=${activeHero.videoStartTime},${activeHero.videoEndTime || ''}` : '')} 
                  autoPlay 
                  muted 
                  playsInline 
                  className="w-full h-full object-cover opacity-60"
                  onTimeUpdate={(e) => {
                    if (activeHero.videoEndTime && e.currentTarget.currentTime >= activeHero.videoEndTime) {
                      e.currentTarget.currentTime = activeHero.videoStartTime || 0;
                      if (heroMedia.length === 1) e.currentTarget.play(); // force replay if single media
                    }
                  }}
                />
              ) : (
                <img 
                  src={activeHero.url} 
                  alt="DJ Nacci Live" 
                  className="w-full h-full object-cover opacity-60"
                />
              )}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background"></div>
        </div>
        
        <div className="container relative z-10 px-6 text-center mt-20 pointer-events-none">
          <p className="text-primary tracking-[0.4em] uppercase text-xs md:text-sm mb-6 animate-in slide-in-from-bottom-4 duration-700 font-bold">
            The Afro House Experience
          </p>
          <h1 className="font-serif text-7xl md:text-[10rem] font-bold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-white via-white/90 to-white/30 mb-10 animate-in slide-in-from-bottom-8 duration-1000 delay-150 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            Nacci
          </h1>
          <a 
            href="#booking"
            className="pointer-events-auto inline-block border border-primary/50 bg-black/30 backdrop-blur-sm text-primary px-10 py-5 uppercase tracking-widest text-sm hover:bg-primary hover:text-black hover:border-primary transition-all duration-500 animate-in fade-in duration-1000 delay-300"
          >
            Book The Artist
          </a>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-32 md:py-40 relative border-t border-border/10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative group">
              {/* Decorative elements */}
              <div className="absolute -inset-4 border border-primary/20 translate-x-4 translate-y-4 -z-10 group-hover:translate-x-6 group-hover:translate-y-6 transition-transform duration-700"></div>
              <div className="absolute -inset-4 border border-border/20 -translate-x-4 -translate-y-4 -z-10 group-hover:-translate-x-6 group-hover:-translate-y-6 transition-transform duration-700"></div>
              
              <div className="w-full aspect-[3/4] bg-black relative overflow-hidden">
                {activeAbout && (
                  <div key={activeAbout.id} className="absolute inset-0 animate-in fade-in duration-1000">
                    {activeAbout.type === 'video' ? (
                      <video 
                        ref={aboutVideoRef}
                        src={activeAbout.url + (activeAbout.videoStartTime !== undefined ? `#t=${activeAbout.videoStartTime},${activeAbout.videoEndTime || ''}` : '')} 
                        autoPlay 
                        muted 
                        playsInline 
                        className="w-full h-full object-cover grayscale-[30%] hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                        onTimeUpdate={(e) => {
                          if (activeAbout.videoEndTime && e.currentTarget.currentTime >= activeAbout.videoEndTime) {
                            e.currentTarget.currentTime = activeAbout.videoStartTime || 0;
                            if (aboutMedia.length === 1) e.currentTarget.play();
                          }
                        }}
                      />
                    ) : (
                      <img 
                        src={activeAbout.url} 
                        alt="DJ Nacci Portrait" 
                        className="w-full h-full object-cover grayscale-[30%] hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                      />
                    )}
                  </div>
                )}
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60"></div>
              </div>
            </div>
            
            <div className="pl-0 lg:pl-10">
              <h2 className="font-serif text-5xl md:text-6xl font-bold uppercase tracking-widest text-glow mb-10 text-white">
                The <span className="text-primary">Artist</span>
              </h2>
              <div className="space-y-8 text-muted-foreground leading-loose text-lg font-light">
                <p>
                  With over <span className="text-primary font-medium">20 years of dedication</span> to the art of music, Nacci's journey began in Tunisia where he discovered his passion for creating unforgettable sonic experiences. His early roots in R&B and hip-hop culture shaped a uniquely fluid musical ear that would become his signature.
                </p>
                <p>
                  After establishing himself in Tunisia, Nacci relocated to France, where he developed and expanded his career throughout Europe and the Middle East. His versatile approach and deep understanding of rhythm allowed him to share decks with industry heavyweights including <span className="text-white font-medium">JAMIIE, ENOO NAPA, AARON SEVILLA, HVMZA, ADASSIYA, CAIIRO, PAUZA, NITEFREAK, and many more</span>.
                </p>
                <p>
                  Passionate about Afro House, Nacci's musical expression knows no boundaries. He masters all musical styles with equal virtuosity, creating limitless mixes that transcend genres. Through his music, he builds profound connections with his audience, transforming each performance into a shared emotional journey that resonates long after the final beat.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY SECTION */}
      {galleryItems.length > 0 && (
        <section className="py-24 bg-black/50 border-y border-border/10">
          <div className="container mx-auto px-6">
            <h2 className="font-serif text-4xl md:text-5xl font-bold uppercase tracking-widest text-glow mb-16 text-center">
              Gallery
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {galleryItems.map((item) => (
                <div key={item.id} className="group relative aspect-video bg-card overflow-hidden border border-border/10">
                  {item.type === "image" ? (
                    <img src={item.url} alt={item.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                  ) : item.type === "youtube" ? (
                    <div className="w-full h-full">
                      <iframe src={item.url} className="w-full h-full" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                    </div>
                  ) : (
                    <video src={item.url} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" muted loop autoPlay playsInline />
                  )}
                  {item.type !== 'youtube' && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <p className="font-serif tracking-widest uppercase text-lg text-white">{item.title}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CONNECT SECTION */}
      <section className="py-32 bg-card relative overflow-hidden border-b border-border/10">
        <div className="absolute inset-0 opacity-5 bg-[url('@/assets/images/texture-1.png')] bg-cover bg-center"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="font-serif text-3xl md:text-5xl font-bold uppercase tracking-widest mb-16">
            Join The Journey
          </h2>
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            {socialLinks.instagram && (
              <a href={socialLinks.instagram} target="_blank" rel="noreferrer" className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full border border-border/20 bg-black/50 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 group">
                <Instagram size={28} className="text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            )}
            {socialLinks.tiktok && (
              <a href={socialLinks.tiktok} target="_blank" rel="noreferrer" className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full border border-border/20 bg-black/50 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 group">
                <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground group-hover:text-primary transition-colors">
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
              </a>
            )}
            {socialLinks.youtube && (
              <a href={socialLinks.youtube} target="_blank" rel="noreferrer" className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full border border-border/20 bg-black/50 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 group">
                <Youtube size={28} className="text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            )}
            {socialLinks.threads && (
              <a href={socialLinks.threads} target="_blank" rel="noreferrer" className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full border border-border/20 bg-black/50 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 group">
                <ThreadsIcon className="text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            )}
          </div>
        </div>
      </section>

      {/* BOOKING SECTION */}
      <section id="booking" className="py-32 md:py-40">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="font-serif text-5xl md:text-6xl font-bold uppercase tracking-widest text-glow mb-6">
              Booking
            </h2>
            <p className="text-muted-foreground uppercase tracking-[0.2em] text-sm font-medium">
              Festivals • Night Clubs • Private Events
            </p>
          </div>
          
          <form onSubmit={handleBookingSubmit} className="space-y-8 glass-panel p-8 md:p-14 border border-border/10 relative">
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="uppercase tracking-widest text-[10px] text-primary font-bold">Full Name / Organization <span className="text-destructive">*</span></label>
                <Input 
                  required
                  value={bookingData.name}
                  onChange={(e) => setBookingData({...bookingData, name: e.target.value})}
                  className="bg-black/30 border-b border-border/30 border-t-0 border-x-0 rounded-none h-12 px-0 focus-visible:ring-0 focus-visible:border-primary transition-colors text-lg" 
                  placeholder="Enter your name"
                />
              </div>
              <div className="space-y-3">
                <label className="uppercase tracking-widest text-[10px] text-primary font-bold">Email Address <span className="text-destructive">*</span></label>
                <Input 
                  required
                  type="email"
                  value={bookingData.email}
                  onChange={(e) => setBookingData({...bookingData, email: e.target.value})}
                  className="bg-black/30 border-b border-border/30 border-t-0 border-x-0 rounded-none h-12 px-0 focus-visible:ring-0 focus-visible:border-primary transition-colors text-lg" 
                  placeholder="contact@example.com"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="space-y-3 md:col-span-1">
                <label className="uppercase tracking-widest text-[10px] text-primary font-bold">Phone Number <span className="text-destructive">*</span></label>
                <div className="flex bg-black/30 border-b border-border/30 focus-within:border-primary transition-colors h-12">
                  <select 
                    value={bookingData.countryCode}
                    onChange={(e) => setBookingData({...bookingData, countryCode: e.target.value})}
                    className="bg-transparent text-foreground border-none outline-none focus:ring-0 text-sm px-2 w-24 cursor-pointer"
                  >
                    {COUNTRY_CODES.map(country => (
                      <option key={country.code} value={country.code} className="bg-background">
                        {country.code}
                      </option>
                    ))}
                  </select>
                  <Input 
                    required
                    type="tel"
                    value={bookingData.phone}
                    onChange={(e) => setBookingData({...bookingData, phone: e.target.value})}
                    className="bg-transparent border-none rounded-none h-full px-2 focus-visible:ring-0 text-lg flex-1" 
                    placeholder="612345678"
                  />
                </div>
              </div>
              <div className="space-y-3 md:col-span-1">
                <label className="uppercase tracking-widest text-[10px] text-primary font-bold">Event Date <span className="text-destructive">*</span></label>
                <Input 
                  required
                  type="date"
                  min={minDate}
                  value={bookingData.date}
                  onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                  className="bg-black/30 border-b border-border/30 border-t-0 border-x-0 rounded-none h-12 px-0 focus-visible:ring-0 focus-visible:border-primary transition-colors text-lg [color-scheme:dark]" 
                />
              </div>
              <div className="space-y-3 md:col-span-1">
                <label className="uppercase tracking-widest text-[10px] text-primary font-bold">Location / Type <span className="text-destructive">*</span></label>
                <Input 
                  required
                  placeholder="e.g. Paris - Club"
                  value={bookingData.eventType}
                  onChange={(e) => setBookingData({...bookingData, eventType: e.target.value})}
                  className="bg-black/30 border-b border-border/30 border-t-0 border-x-0 rounded-none h-12 px-0 focus-visible:ring-0 focus-visible:border-primary transition-colors text-lg" 
                />
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <div className="flex justify-between">
                <label className="uppercase tracking-widest text-[10px] text-primary font-bold">Event Details <span className="text-destructive">*</span></label>
                <span className={`text-[10px] uppercase tracking-widest ${bookingData.details.length < 200 ? 'text-destructive' : 'text-primary'}`}>
                  {bookingData.details.length}/200 min
                </span>
              </div>
              <Textarea 
                required
                minLength={200}
                placeholder="Tell us more about the event, expected capacity, technical requirements..."
                value={bookingData.details}
                onChange={(e) => setBookingData({...bookingData, details: e.target.value})}
                className="bg-black/30 border-b border-border/30 border-t-0 border-x-0 rounded-none min-h-[120px] px-0 focus-visible:ring-0 focus-visible:border-primary transition-colors text-lg resize-none" 
              />
            </div>

            <div className="pt-8">
              <Button 
                type="submit" 
                className="w-full h-16 rounded-none bg-primary text-black hover:bg-white hover:text-black uppercase tracking-[0.2em] font-bold transition-all duration-500 hover:shadow-[0_0_20px_rgba(207,159,45,0.4)]"
              >
                Submit Request
              </Button>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}