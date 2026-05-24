import { Check, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "₹2,999",
    description: "Perfect for small businesses and startups",
    features: [
      "1–3 Page Website",
      "Mobile Responsive",
      "Basic SEO Setup",
      "Contact Form Integration",
      "Fast Loading Speed",
      "7 Days Support",
    ],
    bgColor: "bg-neo-yellow",
    textColor: "text-black",
    tagColor: "text-black/80",
    buttonBg: "bg-white",
    popular: false,
    cta: "Start Now",
  },
  {
    name: "Professional",
    price: "₹5,000",
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
    bgColor: "bg-neo-violet",
    textColor: "text-white",
    tagColor: "text-neo-yellow",
    buttonBg: "bg-neo-yellow",
    popular: true,
    cta: "Choose Professional",
  },
  {
    name: "Enterprise",
    price: "₹9,999",
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
    bgColor: "bg-neo-mint",
    textColor: "text-black",
    tagColor: "text-black/80",
    buttonBg: "bg-white",
    popular: false,
    cta: "Get Enterprise",
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 relative bg-background border-b-3 border-foreground">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 max-w-xl mx-auto">
          <span className="inline-block px-3 py-1 bg-white border-2 border-black rounded-full font-mono text-[10px] font-extrabold uppercase tracking-widest text-neo-violet mb-4 shadow-[2px_2px_0px_0px_#000]">
            Pricing Plans
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold mb-4 text-foreground">
            Choose Your <span className="underline decoration-neo-violet decoration-4">Growth Path</span>
          </h2>
          <p className="text-muted-foreground text-sm font-mono leading-relaxed mt-3">
            Transparent pricing designed to scale with your business. No hidden fees, no surprises.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, index) => {
            const isDarkCard = plan.bgColor === "bg-neo-violet";
            return (
              <div
                key={index}
                className={`relative border-3 border-black rounded-3xl p-8 flex flex-col transition-all duration-350 shadow-[4px_4px_0px_0px_#000] hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[8px_8px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_#000] ${plan.bgColor} ${
                  plan.textColor
                } ${plan.popular ? "lg:-mt-4 lg:mb-4" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="flex items-center gap-1.5 px-4 py-1.5 bg-neo-pink text-white border-2 border-black rounded-xl text-[10px] font-mono font-extrabold uppercase tracking-widest shadow-[2px_2px_0px_0px_#000]">
                      <Sparkles className="size-3.5 fill-current text-neo-yellow" />
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="mb-8">
                  <h3 className={`text-xs font-mono font-extrabold uppercase tracking-wider mb-2 ${plan.tagColor}`}>
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-4xl sm:text-5xl font-extrabold">
                      {plan.price}
                    </span>
                  </div>
                  <p className={`text-xs font-mono mt-3 leading-relaxed ${isDarkCard ? "text-white/80" : "text-black/70"}`}>
                    {plan.description}
                  </p>
                </div>

                <ul className="space-y-3.5 mb-8 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-xs font-mono font-semibold">
                      <div className="p-0.5 bg-white border border-black rounded text-black flex-shrink-0 mt-0.5">
                        <Check className="size-3" />
                      </div>
                      <span className={isDarkCard ? "text-white/90" : "text-black/85"}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#contact"
                  className={`block w-full py-3.5 border-2 border-black text-black font-mono font-extrabold text-sm text-center rounded-xl shadow-[3px_3px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#000] transition-all cursor-pointer ${plan.buttonBg}`}
                >
                  {plan.cta}
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
