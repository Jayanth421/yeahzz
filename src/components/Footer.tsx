import { Zap, Twitter, Linkedin, Instagram, Github } from "lucide-react";

const quickLinks = [
  { label: "Home", href: "#" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];

const serviceLinks = [
  "Web Development",
  "eCommerce",
  "SEO Optimization",
  "Digital Marketing",
  "Branding",
  "App Development",
];

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Github, href: "#", label: "GitHub" },
];

export default function Footer() {
  return (
    <footer className="relative pt-20 pb-8 border-t border-white/5">
      <div className="absolute inset-5 bg-gradient-to-t from-neon-blue/5 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            
              <a href="#" className="flex items-center gap-3 group">
  <img
    src="src/assets/logo.png"
    alt="yeahzz logo"
    className="w-30 h-15 object-contain"
  />
</a>
              
              
            
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Premium web development and digital marketing agency helping businesses
              scale with precision and impact.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, i) => {
                const Icon = social.icon;
                return (
                  <a
                    key={i}
                    href={social.href}
                    aria-label={social.label}
                    className="size-10 glass-card rounded-lg flex items-center justify-center hover:bg-white/10 hover:text-neon-blue transition-all"
                  >
                    <Icon className="size-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-widest mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-widest mb-6">
              Services
            </h4>
            <ul className="space-y-3">
              {serviceLinks.map((service, i) => (
                <li key={i}>
                  <span className="text-sm text-muted-foreground">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-widest mb-6">
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>hello@yeahzz.in</li>
              <li>+91 8341858290</li>
              <li>Hyderabad, India</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
            © 2025 yeahzz. All rights reserved.
           
          </p>
          <div className="flex gap-6 text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
