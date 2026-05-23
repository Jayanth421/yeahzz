import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, Zap } from "lucide-react";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-1/2 -translate-x-1/2 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/50"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <div className="size-8 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
              <Zap className="size-5 text-white" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight">
              LUMINA<span className="text-neon-blue">.</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-white/5"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:block">
            <a
              href="#contact"
              className="px-6 py-2.5 bg-gradient-to-r from-neon-blue to-neon-purple text-white text-sm font-bold rounded-full hover:brightness-110 transition-all shadow-lg shadow-neon-blue/20"
            >
              Start Project
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
          >
            {isMobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border/50">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg transition-colors"
                onClick={() => setIsMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              className="block mt-4 px-4 py-3 bg-gradient-to-r from-neon-blue to-neon-purple text-white text-sm font-bold rounded-lg text-center"
              onClick={() => setIsMobileOpen(false)}
            >
              Start Project
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
