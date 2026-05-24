import { Search, FileText, PenTool, Code, TestTube, Rocket } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Research",
    description: "Deep dive into your industry, competitors, and target audience to build a winning strategy.",
    color: "text-neon-blue",
    bg: "bg-neon-blue/10",
  },
  {
    icon: FileText,
    title: "Planning",
    description: "Wireframes, sitemaps, and project roadmaps that align with your business goals.",
    color: "text-neon-purple",
    bg: "bg-neon-purple/10",
  },
  {
    icon: PenTool,
    title: "Design",
    description: "High-fidelity UI/UX designs with your brand identity baked into every pixel.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Code,
    title: "Development",
    description: "Clean, scalable code using React, Next.js, and modern frameworks.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    icon: TestTube,
    title: "Testing",
    description: "Rigorous QA across devices, browsers, and performance benchmarks.",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
  },
  {
    icon: Rocket,
    title: "Launch",
    description: "Deployment, monitoring, and ongoing optimization for sustained growth.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
];

export default function WorkflowSection() {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-neon-blue mb-4">
            [ 07 ] Our Process
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold mb-4">
            How We <span className="text-gradient">Work</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A proven 6-step workflow that ensures every project is delivered on time, on budget, and beyond expectations.
          </p>
        </div>

        {/* Desktop timeline */}
        <div className="hidden lg:block relative">
          {/* Connecting line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-blue opacity-30" />

          <div className="grid grid-cols-6 gap-4 relative">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isOdd = index % 2 === 0;
              return (
                <div key={index} className="relative">
                  <div
                    className={`flex flex-col ${
                      isOdd ? "items-start" : "items-start"
                    }`}
                  >
                    {/* Step number and icon */}
                    <div className="relative z-10 mb-4">
                      <div
                        className={`size-14 ${step.bg} rounded-2xl flex items-center justify-center border border-white/10`}
                      >
                        <Icon className={`size-6 ${step.color}`} />
                      </div>
                      <div className="absolute -top-2 -right-2 size-6 bg-background rounded-full flex items-center justify-center text-[10px] font-bold border border-white/10">
                        {index + 1}
                      </div>
                    </div>
                    <h3 className="font-display text-lg font-bold mb-2">
                      {step.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile / tablet cards */}
        <div className="lg:hidden space-y-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
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
                className={`flex gap-4 rounded-2xl p-6 transition-all duration-300 ${cardClass}`}
              >
                <div className="flex-shrink-0">
                  <div
                    className={`size-12 ${step.bg} rounded-xl flex items-center justify-center border border-black/10`}
                  >
                    <Icon className={`size-5 ${step.color}`} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-mono text-muted-foreground font-bold">
                      STEP {index + 1}
                    </span>
                    <div className="flex-1 h-px bg-gradient-to-r from-neon-blue/30 to-transparent" />
                  </div>
                  <h3 className="font-display text-lg font-bold mb-1">
                    {step.title}
                  </h3>
                  <p className="text-xs font-mono text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
