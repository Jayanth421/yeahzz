import dashboardMockup from "../assets/dashboard-mockup.jpg";
import fintechImg from "../assets/portfolio-fintech.jpg";
import { ArrowRight, CheckCircle, Sparkles, Star } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen pt-24 pb-16 overflow-hidden flex items-center bg-background">
      <div className="absolute inset-0 grid-bg opacity-70 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid place-items-center">
          <div className="w-full max-w-5xl bg-neo-violet border-3 border-black rounded-3xl shadow-[6px_6px_0px_0px_#000] p-8 sm:p-12 text-white relative overflow-hidden flex flex-col justify-center items-center text-center min-h-[500px] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_#000] transition-all duration-300">
            <div
              className="absolute top-6 right-6 animate-spin text-neo-yellow"
              style={{ animationDuration: "12s" }}
            >
              <Star className="size-8 fill-current text-neo-yellow" stroke="black" strokeWidth={1.5} />
            </div>

            <div className="flex flex-col items-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neo-yellow border-2 border-black text-black text-xs font-mono font-extrabold uppercase tracking-widest mb-8 shadow-[2px_2px_0px_0px_#000]">
                <Sparkles className="size-3.5 fill-current animate-pulse text-neo-orange" />
                [ Next-Gen Digital Agency ]
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[0.95] mb-6 text-white select-none">
                Boost your company {" "}
                <span className="text-neo-yellow underline decoration-black decoration-3">productivity</span>{" "}
                with automated tools.
              </h1>

              <p className="text-white/95 text-sm sm:text-base max-w-2xl mb-10 leading-relaxed font-mono">
                Leverage Machine Learning &amp; Non-Invasive privacy methods. We create premium
                websites, branding systems, and campaign tools to scale your business.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
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

            <div className="absolute bottom-5 right-8 animate-pulse text-neo-pink">
              <Sparkles className="size-8 fill-current text-neo-pink" stroke="black" strokeWidth={1.5} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
