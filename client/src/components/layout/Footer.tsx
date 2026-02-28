import { Instagram, Youtube } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";

// Thread icon custom SVG
const ThreadsIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
    <path d="M12 15.5C13.933 15.5 15.5 13.933 15.5 12C15.5 10.067 13.933 8.5 12 8.5C10.067 8.5 8.5 10.067 8.5 12C8.5 12.8028 8.77098 13.5422 9.22912 14.1332C10.2246 15.4172 12.1901 15.5 13.5 15.5H16.5" />
    <path d="M12 12V8.5" />
  </svg>
);

export default function Footer() {
  const { socialLinks } = useSettings();

  return (
    <footer className="bg-black py-12 border-t border-border/10">
      <div className="container mx-auto px-6 flex flex-col items-center justify-center">
        <h2 className="font-serif text-3xl font-bold text-primary tracking-widest uppercase mb-6 text-glow">
          NACCI
        </h2>
        <div className="flex gap-6 mb-8">
          {socialLinks.instagram && (
            <a href={socialLinks.instagram} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors p-2 border border-border/20 rounded-full hover:border-primary/50">
              <Instagram size={20} />
            </a>
          )}
          {socialLinks.youtube && (
            <a href={socialLinks.youtube} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors p-2 border border-border/20 rounded-full hover:border-primary/50">
              <Youtube size={20} />
            </a>
          )}
          {socialLinks.tiktok && (
            <a href={socialLinks.tiktok} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors p-2 border border-border/20 rounded-full hover:border-primary/50">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
              </svg>
            </a>
          )}
          {socialLinks.threads && (
             <a href={socialLinks.threads} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors p-2 border border-border/20 rounded-full hover:border-primary/50">
               <ThreadsIcon />
             </a>
          )}
        </div>
        <p className="text-muted-foreground text-sm tracking-wider uppercase">
          &copy; {new Date().getFullYear()} DJ NACCI. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
}