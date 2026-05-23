import { useState } from "react";
import { Mail, Phone, MessageCircle, Send, MapPin } from "lucide-react";

export default function ContactSection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section id="contact" className="py-24 relative">
      <div className="absolute inset-5 bg-gradient-to-b from-transparent via-neon-purple/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: Info */}
          <div>
            <span className="inline-block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-neon-purple mb-4">
              [ 09 ] Get In Touch
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-extrabold mb-6 leading-tight">
              Ready to <span className="text-gradient">Scale</span>?
            </h2>
            <p className="text-muted-foreground mb-10 leading-relaxed max-w-md">
              Let's build something extraordinary together. Our team is ready to transform
              your vision into a digital reality that drives real business growth.
            </p>

            <div className="space-y-5">
              <a
                href="mailto:hello@lumina.agency"
                className="flex items-center gap-4 group"
              >
                <div className="size-12 glass-card rounded-xl flex items-center justify-center group-hover:bg-neon-blue/10 transition-colors">
                  <Mail className="size-5 text-neon-blue" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                    Email Us
                  </div>
                  <div className="font-medium group-hover:text-neon-blue transition-colors">
                    hello@lumina.agency
                  </div>
                </div>
              </a>

              <a href="tel:+919876543210" className="flex items-center gap-4 group">
                <div className="size-12 glass-card rounded-xl flex items-center justify-center group-hover:bg-neon-purple/10 transition-colors">
                  <Phone className="size-5 text-neon-purple" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                    Call Us
                  </div>
                  <div className="font-medium group-hover:text-neon-purple transition-colors">
                    +91 98765 43210
                  </div>
                </div>
              </a>

              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 group"
              >
                <div className="size-12 glass-card rounded-xl flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors">
                  <MessageCircle className="size-5 text-emerald-400" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                    WhatsApp
                  </div>
                  <div className="font-medium group-hover:text-emerald-400 transition-colors">
                    Chat on WhatsApp
                  </div>
                </div>
              </a>

              <div className="flex items-center gap-4">
                <div className="size-12 glass-card rounded-xl flex items-center justify-center">
                  <MapPin className="size-5 text-amber-400" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                    Location
                  </div>
                  <div className="font-medium">Mumbai, India</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="glass-card-raised rounded-3xl p-8">
            {submitted ? (
              <div className="text-center py-12">
                <div className="size-16 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full flex items-center justify-center mx-auto mb-6">
                  <Send className="size-8 text-white" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-2">
                  Message Sent!
                </h3>
                <p className="text-muted-foreground text-sm">
                  We'll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm outline-none focus:border-neon-blue/50 transition-colors placeholder:text-muted-foreground/50"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm outline-none focus:border-neon-blue/50 transition-colors placeholder:text-muted-foreground/50"
                      placeholder="john@company.com"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm outline-none focus:border-neon-blue/50 transition-colors placeholder:text-muted-foreground/50"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
                      Service Needed
                    </label>
                    <select
                      value={form.service}
                      onChange={(e) =>
                        setForm({ ...form, service: e.target.value })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm outline-none focus:border-neon-blue/50 transition-colors text-muted-foreground"
                    >
                      <option value="">Select a service</option>
                      <option value="web">Web Development</option>
                      <option value="ecommerce">eCommerce</option>
                      <option value="seo">SEO Optimization</option>
                      <option value="marketing">Digital Marketing</option>
                      <option value="branding">Branding</option>
                      <option value="app">App Development</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
                    Project Details
                  </label>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm outline-none focus:border-neon-blue/50 transition-colors placeholder:text-muted-foreground/50 resize-none"
                    placeholder="Tell us about your project..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-neon-blue to-neon-purple rounded-xl font-bold text-sm uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-neon-blue/20"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
