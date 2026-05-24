import dashboardMockup from "../assets/dashboard-mockup.jpg";
import fintechImg from "../assets/portfolio-fintech.jpg";
import appImg from "../assets/portfolio-app.jpg";
import { ArrowRight, Star, Sparkles, CheckCircle } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen pt-24 pb-16 overflow-hidden flex items-center bg-background">
      {/* Neo-brutalist grid background overlay */}
      <div className="absolute inset-0 grid-bg opacity-70 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Left panel: Violet Hero block (Avota style) */}
          <div className="lg:col-span-7 bg-neo-violet border-3 border-black rounded-3xl shadow-[6px_6px_0px_0px_#000] p-8 sm:p-12 text-white relative overflow-hidden flex flex-col justify-between min-h-[500px] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_#000] transition-all duration-300">
            {/* Absolute vector stars */}
            <div className="absolute top-6 right-6 animate-spin text-neo-yellow" style={{ animationDuration: "12s" }}>
              <Star className="size-8 fill-current text-neo-yellow" stroke="black" strokeWidth={1.5} />
            </div>

            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neo-yellow border-2 border-black text-black text-xs font-mono font-extrabold uppercase tracking-widest mb-8 shadow-[2px_2px_0px_0px_#000]">
                <Sparkles className="size-3.5 fill-current animate-pulse text-neo-orange" />
                [ Next-Gen Digital Agency ]
              </div>

              {/* Heading */}
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[0.95] mb-6 text-white select-none">
                Boost your company <span className="text-neo-yellow underline decoration-black decoration-3">productivity</span> with automated tools.
              </h1>

              {/* Subtext */}
              <p className="text-white/95 text-sm sm:text-base max-w-lg mb-10 leading-relaxed font-mono">
                Leverage Machine Learning & Non-Invasive privacy methods. We create premium websites, branding systems, and campaign tools to scale your business.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-neo-cream text-black font-mono font-extrabold uppercase tracking-wider text-xs border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#000] transition-all cursor-pointer"
              >
                Get Started
                <ArrowRight className="size-4 text-black" />
              </a>
              <a
                href="#portfolio"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-neo-green hover:bg-emerald-400 text-black font-mono font-extrabold uppercase tracking-wider text-xs border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#000] transition-all cursor-pointer"
              >
                View Portfolio
              </a>
            </div>
          </div>

          {/* Right panel: Mint Green Grid panel with floating windows */}
          <div className="lg:col-span-5 bg-neo-green/20 dark:bg-card border-3 border-black rounded-3xl shadow-[6px_6px_0px_0px_#000] p-6 relative overflow-hidden flex flex-col justify-center items-center min-h-[500px]">
            {/* Absolute background stars */}
            <div className="absolute top-12 left-8 text-neo-pink">
              <Star className="size-6 fill-current text-neo-pink animate-bounce" stroke="black" strokeWidth={1.5} />
            </div>

            {/* Window 1: Large Mockup window */}
            <div className="w-full bg-white dark:bg-black border-3 border-black rounded-2xl shadow-[4px_4px_0px_0px_#000] overflow-hidden mb-6 relative hover:scale-[1.02] transition-transform duration-300">
              {/* Window Header bar */}
              <div className="flex items-center justify-between px-4 py-2 border-b-3 border-black bg-neo-cream dark:bg-zinc-800">
                <div className="flex items-center gap-1.5">
                  <div className="size-2.5 rounded-full bg-red-400 border border-black" />
                  <div className="size-2.5 rounded-full bg-yellow-400 border border-black" />
                  <div className="size-2.5 rounded-full bg-green-400 border border-black" />
                </div>
                <span className="font-mono text-[9px] uppercase font-bold text-muted-foreground">yeahzz_analytics.exe</span>
              </div>
              <img
                src={dashboardMockup}
                alt="Saas dashboard mockup"
                className="w-full h-auto object-cover grayscale-25"
              />
            </div>

            {/* Sub-grid of smaller floating cards */}
            <div className="grid grid-cols-2 gap-4 w-full">
              {/* Window 2: Customer portrait */}
              <div className="bg-neo-yellow border-3 border-black rounded-2xl shadow-[4px_4px_0px_0px_#000] overflow-hidden flex flex-col hover:rotate-2 transition-transform">
                <div className="flex items-center px-3 py-1.5 border-b-2 border-black bg-white">
                  <div className="size-2 rounded-full bg-black" />
                  <span className="font-mono text-[9px] font-bold ml-1.5">developer.png</span>
                </div>
                <div className="p-3 bg-white flex-1 flex items-center justify-center min-h-[100px]">
                  <img
                    src={fintechImg}
                    alt="Team developer portrait"
                    className="w-full h-24 object-cover border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000]"
                  />
                </div>
              </div>

              {/* Window 3: Floating metrics widget */}
              <div className="bg-neo-blue border-3 border-black rounded-2xl shadow-[4px_4px_0px_0px_#000] p-4 flex flex-col justify-between text-black hover:-rotate-2 transition-transform">
                <div className="flex justify-between items-start">
                  <span className="font-mono text-[9px] font-bold uppercase tracking-widest bg-white border border-black px-1.5 py-0.5 rounded">
                    Metrics
                  </span>
                  <CheckCircle className="size-5 text-emerald-600 fill-white" />
                </div>
                <div>
                  <h4 className="font-display font-extrabold text-2xl leading-none mt-4">+247%</h4>
                  <p className="font-mono text-[9.5px] font-bold text-black/70 mt-1 uppercase tracking-tight">Traffic Growth</p>
                </div>
              </div>
            </div>

            {/* Visual Vector Sparkle */}
            <div className="absolute bottom-4 right-8 animate-pulse text-neo-pink">
              <Sparkles className="size-8 fill-current text-neo-pink" stroke="black" strokeWidth={1.5} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
