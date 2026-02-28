import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Instagram, Youtube } from "lucide-react";

// Assets
import heroBg from "@/assets/images/hero-bg.png";
import djPortrait from "@/assets/images/dj-portrait.png";

export default function Home() {
  const { toast } = useToast();
  const [bookingData, setBookingData] = useState({
    name: "",
    email: "",
    date: "",
    eventType: "",
    details: ""
  });

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Booking Request Sent",
      description: "Thank you. DJ Nacci's management will contact you shortly.",
      variant: "default",
    });
    setBookingData({ name: "", email: "", date: "", eventType: "", details: "" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative selection:bg-primary/30">
      <div className="grain-overlay"></div>
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroBg} 
            alt="DJ Nacci Live" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background"></div>
        </div>
        
        <div className="container relative z-10 px-6 text-center mt-20">
          <p className="text-primary tracking-[0.3em] uppercase text-sm mb-4 animate-in slide-in-from-bottom-4 duration-700">
            The Afro House Experience
          </p>
          <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl font-bold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 mb-8 animate-in slide-in-from-bottom-8 duration-1000 delay-150">
            Nacci
          </h1>
          <a 
            href="#booking"
            className="inline-block border border-primary text-primary px-8 py-4 uppercase tracking-widest text-sm hover:bg-primary hover:text-black transition-all duration-500 animate-in fade-in duration-1000 delay-300"
          >
            Book The Artist
          </a>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-24 md:py-32 relative">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -inset-4 border border-primary/20 translate-x-4 translate-y-4 -z-10"></div>
              <img 
                src={djPortrait} 
                alt="DJ Nacci Portrait" 
                className="w-full h-[600px] object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
              />
            </div>
            <div>
              <h2 className="font-serif text-4xl md:text-5xl font-bold uppercase tracking-widest text-glow mb-8">
                The Artist
              </h2>
              <div className="space-y-6 text-muted-foreground leading-relaxed text-lg font-light">
                <p>
                  With over <span className="text-primary">20 years of dedication</span> to the art of music, Nacci's journey began in Tunisia where he discovered his passion for creating unforgettable sonic experiences. His early roots in R&B and hip-hop culture shaped a uniquely fluid musical ear that would become his signature.
                </p>
                <p>
                  After establishing himself in Tunisia, Nacci relocated to France, where he developed and expanded his career throughout Europe and the Middle East. His versatile approach and deep understanding of rhythm allowed him to share decks with industry heavyweights including <span className="text-white">JAMIIE, ENOO NAPA, AARON SEVILLA, HVMZA, ADASSIYA, CAIIRO, PAUZA, and NITEFREAK</span>.
                </p>
                <p>
                  Passionate about Afro House, Nacci's musical expression knows no boundaries. He masters all musical styles with equal virtuosity, creating limitless mixes that transcend genres. Through his music, he builds profound connections with his audience, transforming each performance into a shared emotional journey that resonates long after the final beat.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONNECT SECTION */}
      <section className="py-24 bg-card relative overflow-hidden border-y border-border/10">
        <div className="absolute inset-0 opacity-10 bg-[url('@/assets/images/texture-1.png')] bg-cover bg-center"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold uppercase tracking-widest mb-12">
            Join The Journey
          </h2>
          <div className="flex flex-wrap justify-center gap-8">
            <a href="#" className="flex items-center gap-3 px-8 py-4 glass-panel hover:border-primary/50 transition-colors group">
              <Instagram className="text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="uppercase tracking-widest text-sm font-medium">Instagram</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-8 py-4 glass-panel hover:border-primary/50 transition-colors group">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-music-2 text-muted-foreground group-hover:text-primary transition-colors">
                <circle cx="8" cy="18" r="4"/>
                <path d="M12 18V2l7 4"/>
              </svg>
              <span className="uppercase tracking-widest text-sm font-medium">TikTok</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-8 py-4 glass-panel hover:border-primary/50 transition-colors group">
              <Youtube className="text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="uppercase tracking-widest text-sm font-medium">YouTube</span>
            </a>
          </div>
        </div>
      </section>

      {/* BOOKING SECTION */}
      <section id="booking" className="py-24 md:py-32">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold uppercase tracking-widest text-glow mb-4">
              Booking
            </h2>
            <p className="text-muted-foreground uppercase tracking-widest text-sm">
              Festivals • Night Clubs • Private Events
            </p>
          </div>
          
          <form onSubmit={handleBookingSubmit} className="space-y-8 glass-panel p-8 md:p-12 border-t-2 border-t-primary/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="uppercase tracking-widest text-xs text-muted-foreground">Full Name / Organization</label>
                <Input 
                  required
                  value={bookingData.name}
                  onChange={(e) => setBookingData({...bookingData, name: e.target.value})}
                  className="bg-background/50 border-border/30 focus-visible:ring-primary focus-visible:border-primary rounded-none h-12" 
                />
              </div>
              <div className="space-y-2">
                <label className="uppercase tracking-widest text-xs text-muted-foreground">Email Address</label>
                <Input 
                  required
                  type="email"
                  value={bookingData.email}
                  onChange={(e) => setBookingData({...bookingData, email: e.target.value})}
                  className="bg-background/50 border-border/30 focus-visible:ring-primary focus-visible:border-primary rounded-none h-12" 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="uppercase tracking-widest text-xs text-muted-foreground">Event Date</label>
                <Input 
                  required
                  type="date"
                  value={bookingData.date}
                  onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                  className="bg-background/50 border-border/30 focus-visible:ring-primary focus-visible:border-primary rounded-none h-12 [color-scheme:dark]" 
                />
              </div>
              <div className="space-y-2">
                <label className="uppercase tracking-widest text-xs text-muted-foreground">Event Type / Location</label>
                <Input 
                  required
                  placeholder="e.g. Night Club in Paris"
                  value={bookingData.eventType}
                  onChange={(e) => setBookingData({...bookingData, eventType: e.target.value})}
                  className="bg-background/50 border-border/30 focus-visible:ring-primary focus-visible:border-primary rounded-none h-12" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="uppercase tracking-widest text-xs text-muted-foreground">Event Details</label>
              <Textarea 
                required
                placeholder="Tell us more about the event, expected capacity, etc."
                value={bookingData.details}
                onChange={(e) => setBookingData({...bookingData, details: e.target.value})}
                className="bg-background/50 border-border/30 focus-visible:ring-primary focus-visible:border-primary rounded-none min-h-[150px] resize-none" 
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 rounded-none bg-primary text-black hover:bg-white hover:text-black uppercase tracking-widest font-bold transition-all duration-300"
            >
              Submit Request
            </Button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}