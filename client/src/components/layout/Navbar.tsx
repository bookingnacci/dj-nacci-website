import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" }
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-500 border-b border-transparent",
        isScrolled
          ? "bg-background/90 backdrop-blur-md border-border/50 py-4 shadow-lg shadow-black/20"
          : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link href="/">
          <a className="font-serif text-2xl font-bold tracking-widest text-primary uppercase text-glow">
            NACCI
          </a>
        </Link>
        <div className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href}>
              <a
                className={cn(
                  "text-sm font-medium tracking-widest uppercase transition-colors hover:text-primary",
                  location === link.href ? "text-primary" : "text-muted-foreground"
                )}
              >
                {link.name}
              </a>
            </Link>
          ))}
          <a
            href="/#booking"
            className="px-6 py-2 border border-primary text-primary text-sm tracking-widest uppercase hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          >
            Book Now
          </a>
        </div>
      </div>
    </nav>
  );
}