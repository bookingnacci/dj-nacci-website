import { Instagram, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black py-12 border-t border-border/10">
      <div className="container mx-auto px-6 flex flex-col items-center justify-center">
        <h2 className="font-serif text-3xl font-bold text-primary tracking-widest uppercase mb-6 text-glow">
          NACCI
        </h2>
        <div className="flex gap-6 mb-8">
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors p-2 border border-border/20 rounded-full hover:border-primary/50">
            <Instagram size={20} />
          </a>
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors p-2 border border-border/20 rounded-full hover:border-primary/50">
            <Youtube size={20} />
          </a>
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors p-2 border border-border/20 rounded-full hover:border-primary/50">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-music-2">
              <circle cx="8" cy="18" r="4"/>
              <path d="M12 18V2l7 4"/>
            </svg>
          </a>
        </div>
        <p className="text-muted-foreground text-sm tracking-wider uppercase">
          &copy; {new Date().getFullYear()} DJ Nacci. All rights reserved.
        </p>
      </div>
    </footer>
  );
}