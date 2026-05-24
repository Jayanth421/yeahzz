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

    if (typeof window !== "undefined") {
      try {
        const storedSubmissions = localStorage.getItem("nexus_craft_submissions");
        const submissions = storedSubmissions ? JSON.parse(storedSubmissions) : [];
        
        const newSubmission = {
          id: Date.now().toString(36) + Math.random().toString(36).substring(2, 7),
          name: form.name,
          email: form.email,
          phone: form.phone,
          service: form.service || "web", // Default to "web" or empty if none selected, but form select has options
          message: form.message,
          timestamp: new Date().toISOString(),
          status: "active", // Default status is active
        };

        submissions.push(newSubmission);
        localStorage.setItem("nexus_craft_submissions", JSON.stringify(submissions));
      } catch (error) {
        console.error("Error saving submission to localStorage:", error);
      }
    }

    setSubmitted(true);
    setForm({
      name: "",
      email: "",
      phone: "",
      service: "",
      message: "",
    });
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
                href="mailto:hello@yeahzz.in"
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
                    hello@yeahzz.in
                  </div>
                </div>
              </a>

              <a href="tel:+918341858290" className="flex items-center gap-4 group">
                <div className="size-12 glass-card rounded-xl flex items-center justify-center group-hover:bg-neon-purple/10 transition-colors">
                  <Phone className="size-5 text-neon-purple" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                    Call Us
                  </div>
                  <div className="font-medium group-hover:text-neon-purple transition-colors">
                    +91 8341858290
                  </div>
                </div>
              </a>

              <a
                href="https://wa.me/918341858290"
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
                  <div className="font-medium">Hyderabad, India</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="bg-white dark:bg-card border-3 border-black rounded-3xl p-8 shadow-[6px_6px_0px_0px_#000] relative z-10">
            {submitted ? (
              <div className="text-center py-12">
                <div className="size-16 bg-neo-pink rounded-full border-2 border-black flex items-center justify-center mx-auto mb-6 shadow-[3px_3px_0px_0px_#000]">
                  <Send className="size-8 text-black" />
                </div>
                <h3 className="font-display text-2xl font-extrabold text-black dark:text-white mb-2">
                  Message Sent!
                </h3>
                <p className="text-muted-foreground font-mono text-xs">
                  We'll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono font-bold uppercase tracking-widest text-foreground mb-2 block">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className="w-full bg-white dark:bg-black/60 border-2 border-black rounded-xl p-4 text-sm text-foreground outline-none focus:bg-neo-cream focus:text-black transition-colors placeholder:text-muted-foreground/50 shadow-[2px_2px_0px_0px_#000] font-mono"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono font-bold uppercase tracking-widest text-foreground mb-2 block">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      className="w-full bg-white dark:bg-black/60 border-2 border-black rounded-xl p-4 text-sm text-foreground outline-none focus:bg-neo-cream focus:text-black transition-colors placeholder:text-muted-foreground/50 shadow-[2px_2px_0px_0px_#000] font-mono"
                      placeholder="hello@example.com"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono font-bold uppercase tracking-widest text-foreground mb-2 block">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      className="w-full bg-white dark:bg-black/60 border-2 border-black rounded-xl p-4 text-sm text-foreground outline-none focus:bg-neo-cream focus:text-black transition-colors placeholder:text-muted-foreground/50 shadow-[2px_2px_0px_0px_#000] font-mono"
                      placeholder="+91 9565656554"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono font-bold uppercase tracking-widest text-foreground mb-2 block">
                      Service Needed
                    </label>
                    <select
                      value={form.service}
                      onChange={(e) =>
                        setForm({ ...form, service: e.target.value })
                      }
                      className="w-full bg-white dark:bg-black/60 border-2 border-black rounded-xl p-4 text-sm text-foreground outline-none focus:bg-neo-cream focus:text-black transition-colors shadow-[2px_2px_0px_0px_#000] font-mono"
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
                  <label className="text-xs font-mono font-bold uppercase tracking-widest text-foreground mb-2 block">
                    Project Details
                  </label>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    className="w-full bg-white dark:bg-black/60 border-2 border-black rounded-xl p-4 text-sm text-foreground outline-none focus:bg-neo-cream focus:text-black transition-colors placeholder:text-muted-foreground/50 shadow-[2px_2px_0px_0px_#000] font-mono resize-none"
                    placeholder="Tell us about your project..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-neo-violet text-white border-2 border-black rounded-xl font-mono font-bold text-sm uppercase tracking-widest shadow-[3px_3px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#000] transition-all cursor-pointer"
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
