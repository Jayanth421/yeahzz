import dashboardMockup from "../assets/dashboard-mockup.jpg";
import { ArrowRight, Play } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen pt-20 pb-16 overflow-hidden flex items-center">
      {/* Background glow blobs */}
      <div className="absolute top-1/4 left-1/4 size-[500px] rounded-full bg-neon-blue/10 blur-[120px] animate-float pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 size-[500px] rounded-full bg-neon-purple/10 blur-[120px] animate-float-delayed pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[700px] rounded-full bg-neon-blue/5 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neon-blue/10 border border-neon-blue/20 text-neon-blue text-[10px] font-bold uppercase tracking-widest mb-6 animate-pulse-glow">
              <span className="relative flex size-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-blue opacity-75" />
                <span className="relative inline-flex rounded-full size-2 bg-neon-blue" />
              </span>
              Next-Gen Digital Agency
            </div>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] mb-6">
              Build{" "}
              <span className="text-gradient">Powerful</span>{" "}
              Websites & Grow Your Business Digitally
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              We create high-performance websites, branding systems, and digital marketing
              campaigns that help businesses scale faster with precision and impact.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <a
                href="#contact"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-neon-blue to-neon-purple text-white font-bold rounded-xl hover:brightness-110 transition-all shadow-lg shadow-neon-blue/25 text-sm"
              >
                Get Started
                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#portfolio"
                className="group inline-flex items-center gap-2 px-8 py-4 glass-card font-bold rounded-xl hover:bg-white/5 transition-all text-sm"
              >
                <Play className="size-4" />
                View Portfolio
              </a>
            </div>
          </div>

          {/* Right: Dashboard mockup */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-neon-blue/20 to-neon-purple/20 blur-3xl opacity-60 pointer-events-none" />
            <div className="relative glass-card-raised rounded-2xl overflow-hidden shadow-2xl group">
              <div className="absolute inset-5 bg-gradient-to-tr from-neon-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <img
                src={dashboardMockup}
                alt="Premium SaaS dashboard mockup"
                width={1200}
                height={700}
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Floating UI card */}
            <div className="absolute -bottom-6 -left-6 glass-card-raised rounded-xl p-4 shadow-xl hidden lg:flex items-center gap-3 animate-float">
              <div className="size-10 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
                <span className="text-white font-bold text-sm">↑</span>
              </div>
              <div>
                <div className="text-xs font-bold">Traffic Growth</div>
                <div className="text-[10px] text-muted-foreground">+247% this month</div>
              </div>
            </div>

            {/* Another floating card */}
            <div className="absolute -top-4 -right-4 glass-card-raised rounded-xl p-4 shadow-xl hidden lg:flex items-center gap-3 animate-float-delayed">
              <div className="size-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <span className="text-emerald-400 font-bold text-sm">✓</span>
              </div>
              <div>
                <div className="text-xs font-bold">SEO Score</div>
                <div className="text-[10px] text-muted-foreground">98/100 Excellent</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
