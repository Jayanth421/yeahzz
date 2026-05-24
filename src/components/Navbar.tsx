import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";

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
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background border-b-3 border-foreground shadow-[0_4px_0_0_rgba(255,255,255,0.05)]"
          : "bg-background border-b-3 border-foreground"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group bg-white px-3 py-1 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#000] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#000] transition-all">
            <img
              src="src/assets/logo.png"
              alt="yeahzz logo"
              className="w-24 h-10 object-contain"
            />
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3.5 py-1.5 text-xs uppercase font-mono font-bold tracking-wider text-foreground border-2 border-transparent hover:border-foreground hover:bg-neo-yellow/20 rounded-xl transition-all"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right actions: Portal Link + CTA */}
          <div className="hidden md:flex items-center gap-4">
            {/* Portal Link */}
            <Link
              to="/admin"
              className="px-4 py-2 border-2 border-foreground text-xs font-mono font-extrabold uppercase tracking-wider rounded-xl bg-neo-green text-black hover:translate-x-[-1px] hover:translate-y-[-1px] shadow-[2px_2px_0px_0px_var(--color-border)] hover:shadow-[3px_3px_0px_0px_var(--color-border)] active:translate-x-[1px] active:translate-y-[1px] transition-all"
            >
              Admin Portal
            </Link>

            {/* CTA */}
            <a
              href="#contact"
              className="px-5 py-2.5 bg-neo-violet text-white text-xs font-mono font-extrabold uppercase tracking-wider rounded-xl border-2 border-foreground shadow-[2px_2px_0px_0px_var(--color-border)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_var(--color-border)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_var(--color-border)] transition-all"
            >
              Start Project
            </a>
          </div>

          {/* Mobile toggle actions */}
          <div className="md:hidden flex items-center gap-3">
            <button
              className="p-2 border-2 border-foreground rounded-xl bg-card text-foreground"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
              {isMobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className="md:hidden bg-background border-t-2 border-foreground">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block px-4 py-2 text-sm font-mono font-bold uppercase tracking-wider text-foreground hover:bg-muted border border-transparent hover:border-foreground rounded-xl transition-all"
                onClick={() => setIsMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            
            <Link
              to="/admin"
              className="block px-4 py-3 bg-neo-green text-black font-mono font-bold text-center border-2 border-foreground rounded-xl shadow-[2px_2px_0px_0px_var(--color-border)]"
              onClick={() => setIsMobileOpen(false)}
            >
              Admin Portal
            </Link>

            <a
              href="#contact"
              className="block px-4 py-3 bg-neo-violet text-white font-mono font-bold text-center border-2 border-foreground rounded-xl shadow-[2px_2px_0px_0px_var(--color-border)]"
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
