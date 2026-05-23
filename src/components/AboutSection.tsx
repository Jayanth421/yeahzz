import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 150, suffix: "+", label: "Projects Completed" },
  { value: 98, suffix: "%", label: "Client Satisfaction" },
  { value: 5, suffix: "+", label: "Years Experience" },
  { value: 120, suffix: "+", label: "Happy Clients" },
];

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="text-center">
      <div className="font-display text-4xl sm:text-5xl font-extrabold text-gradient">
        {count}
        {suffix}
      </div>
      <div className="text-xs sm:text-sm text-muted-foreground uppercase tracking-widest mt-2">
        {stats.find((s) => s.value === target)?.label}
      </div>
    </div>
  );
}

export default function AboutSection() {
  return (
    <section id="about" className="py-24 relative">
      <div className="absolute inset-5 bg-gradient-to-b from-transparent via-neon-blue/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* About content */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <span className="inline-block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-neon-purple mb-4">
              [ 02 ] About Us
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-extrabold mb-6 leading-tight">
              We Build Digital{" "}
              <span className="text-gradient">Experiences</span> That Matter
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              We are a creative digital agency focused on building powerful digital experiences
              for modern brands. Our mission is to help businesses grow using high-performance
              websites and data-driven marketing strategies that deliver measurable results.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              With a team of passionate designers, developers, and marketers, we transform ideas
              into reality — creating websites and campaigns that not only look stunning but also
              convert visitors into loyal customers.
            </p>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 glass-card rounded-lg px-4 py-2">
                <div className="size-2 rounded-full bg-neon-blue" />
                <span className="text-sm font-medium">React & Next.js</span>
              </div>
              <div className="flex items-center gap-2 glass-card rounded-lg px-4 py-2">
                <div className="size-2 rounded-full bg-neon-purple" />
                <span className="text-sm font-medium">Tailwind CSS</span>
              </div>
              <div className="flex items-center gap-2 glass-card rounded-lg px-4 py-2">
                <div className="size-2 rounded-full bg-emerald-400" />
                <span className="text-sm font-medium">Node.js</span>
              </div>
            </div>
          </div>

          {/* Visual area */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-neon-blue/10 to-neon-purple/10 blur-2xl rounded-3xl pointer-events-none" />
            <div className="glass-card-raised rounded-3xl p-8 relative overflow-hidden">
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card rounded-xl p-6 text-center">
                  <div className="font-display text-3xl font-extrabold text-neon-blue mb-1">99.9%</div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Uptime SLA</div>
                </div>
                <div className="glass-card rounded-xl p-6 text-center">
                  <div className="font-display text-3xl font-extrabold text-neon-purple mb-1">&lt;1s</div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Page Load</div>
                </div>
                <div className="glass-card rounded-xl p-6 text-center">
                  <div className="font-display text-3xl font-extrabold text-emerald-400 mb-1">A+</div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">SEO Score</div>
                </div>
                <div className="glass-card rounded-xl p-6 text-center">
                  <div className="font-display text-3xl font-extrabold text-amber-400 mb-1">24/7</div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Support</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="glass-card-raised rounded-3xl p-8 sm:p-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
            {stats.map((stat, index) => (
              <AnimatedCounter key={index} target={stat.value} suffix={stat.suffix} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
