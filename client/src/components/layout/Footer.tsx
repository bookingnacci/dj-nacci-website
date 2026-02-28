import { useSettings } from "@/contexts/SettingsContext";

export default function Footer() {
  const { socialLinks } = useSettings();

  return (
    <footer className="bg-black py-16 border-t border-border/10">
      <div className="container mx-auto px-6 flex flex-col items-center justify-center text-center">
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary tracking-[0.2em] uppercase mb-4 text-glow drop-shadow-[0_0_15px_rgba(207,159,45,0.2)]">
          NACCI
        </h2>
        <p className="font-serif text-primary tracking-[0.3em] uppercase text-sm md:text-base mb-12 drop-shadow-[0_0_10px_rgba(207,159,45,0.4)] font-medium">
          Feel the music, or die trying
        </p>
        <p className="text-muted-foreground text-[10px] tracking-[0.2em] uppercase opacity-50">
          &copy; {new Date().getFullYear()} DJ NACCI. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
}