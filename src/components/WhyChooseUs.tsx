import {
  Rocket,
  Sparkles,
  TrendingUp,
  Smartphone,
  Cpu,
  Headphones,
} from "lucide-react";

const features = [
  {
    icon: Rocket,
    title: "Fast Delivery",
    description: "Projects delivered in 5-20 days with agile methodology and clear milestones.",
    color: "text-neon-blue",
    bg: "bg-neon-blue/10",
  },
  {
    icon: Sparkles,
    title: "Premium UI/UX",
    description: "Award-winning design aesthetics with user-first approach and pixel-perfect details.",
    color: "text-neon-purple",
    bg: "bg-neon-purple/10",
  },
  {
    icon: TrendingUp,
    title: "SEO Optimized",
    description: "Built with technical SEO best practices from day one for maximum visibility.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Smartphone,
    title: "Mobile Responsive",
    description: "Flawless experience across all devices — mobile, tablet, and desktop.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    icon: Cpu,
    title: "Modern Technologies",
    description: "React, Next.js, Tailwind, Node.js — cutting-edge stack for performance.",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Round-the-clock assistance via WhatsApp, email, and dedicated project channels.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 relative">
      <div className="absolute top-0 right-0 size-[400px] bg-neon-purple/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-neon-blue mb-4">
            [ 03 ] Why Choose Us
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold mb-4">
            Built for <span className="text-gradient">Excellence</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Every pixel, every line of code, every campaign strategy is crafted to deliver
            exceptional results for your business.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const cardClasses = [
              "neo-card-blue",
              "neo-card-violet",
              "neo-card-green",
              "neo-card-yellow",
              "neo-card-pink",
              "neo-card-orange",
            ];
            const cardClass = cardClasses[index % cardClasses.length];

            return (
              <div
                key={index}
                className={`group rounded-2xl p-8 transition-all duration-300 ${cardClass}`}
              >
                <div
                  className={`size-14 ${feature.bg} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-black/10`}
                >
                  <Icon className={`size-7 ${feature.color}`} />
                </div>
                <h3 className="font-display text-xl font-bold mb-3 group-hover:text-neo-pink transition-colors">
                  {feature.title}
                </h3>
                <p className="text-xs font-mono text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
