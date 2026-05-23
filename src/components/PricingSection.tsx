import { Check, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "₹9,999",
    description: "Perfect for small businesses and startups",
    features: [
      "1–3 Page Website",
      "Mobile Responsive",
      "Basic SEO Setup",
      "Contact Form Integration",
      "Fast Loading Speed",
      "7 Days Support",
    ],
    popular: false,
    cta: "Start Now",
  },
  {
    name: "Professional",
    price: "₹24,999",
    description: "Ideal for growing businesses",
    features: [
      "5–10 Page Website",
      "Premium UI/UX Design",
      "Advanced SEO Optimization",
      "Social Media Integration",
      "WhatsApp Integration",
      "Speed Optimization",
      "30 Days Support",
    ],
    popular: true,
    cta: "Choose Professional",
  },
  {
    name: "Enterprise",
    price: "₹59,999",
    description: "For businesses that need it all",
    features: [
      "Fully Custom Website/Web App",
      "eCommerce with Payment Gateway",
      "Complete Branding Package",
      "Digital Marketing Setup",
      "Analytics Dashboard",
      "Premium Animations",
      "Unlimited Revisions",
      "Priority 24/7 Support",
    ],
    popular: false,
    cta: "Get Enterprise",
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-neon-purple/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-neon-blue mb-4">
            [ 05 ] Pricing
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold mb-4">
            Choose Your <span className="text-gradient">Growth Path</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Transparent pricing designed to scale with your business. No hidden fees, no surprises.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative glass-card rounded-3xl p-8 flex flex-col transition-all duration-300 hover:scale-[1.02] ${
                plan.popular
                  ? "border-neon-purple/40 shadow-[1px 0px 40px oklch(0.55 1.2 3.5 / 15%)] lg:-mt-4 lg:mb-4"
                  : "glow-hover"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full text-[10px] font-bold uppercase tracking-widest text-white">
                    <Sparkles className="size-3" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="mb-8">
                <h3
                  className={`text-xs font-bold uppercase tracking-tighter mb-2 ${
                    plan.popular ? "text-neon-purple" : "text-muted-foreground"
                  }`}
                >
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-4xl sm:text-5xl font-extrabold">
                    {plan.price}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <Check
                      className={`size-4 mt-0.5 flex-shrink-0 ${
                        plan.popular ? "text-neon-purple" : "text-neon-blue"
                      }`}
                    />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`block w-full py-3.5 rounded-xl font-bold text-sm text-center transition-all ${
                  plan.popular
                    ? "bg-gradient-to-r from-neon-blue to-neon-purple text-white hover:brightness-110 shadow-lg shadow-neon-purple/20"
                    : "glass-card hover:bg-white/5 text-foreground"
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
