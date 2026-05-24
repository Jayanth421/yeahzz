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
    popular: false,
    cta: "Start Now",
  },
  {
    name: "Professional",
    price: "₹4,999",
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
          {plans.map((plan, index) => {
            const isStarter = index === 0;
            const isProfessional = index === 1;
            const isEnterprise = index === 2;

            let cardClass = "";
            let btnClass = "";
            let priceClass = "";
            let tagColor = "";

            if (isStarter) {
              cardClass = "neo-card-blue";
              priceClass = "text-neo-blue";
              tagColor = "text-neo-blue border-neo-blue/20 bg-neo-blue/5";
              btnClass = "bg-neo-blue text-black hover:bg-neo-blue/95 shadow-[3px_3px_0px_0px_#000]";
            } else if (isProfessional) {
              cardClass = "neo-card-violet lg:-mt-4 lg:mb-4 relative z-10 scale-[1.03]";
              priceClass = "text-neo-violet";
              tagColor = "text-neo-violet border-neo-violet/20 bg-neo-violet/5";
              btnClass = "bg-neo-violet text-white hover:bg-neo-violet/95 shadow-[4px_4px_0px_0px_#000]";
            } else {
              cardClass = "neo-card-pink";
              priceClass = "text-neo-pink";
              tagColor = "text-neo-pink border-neo-pink/20 bg-neo-pink/5";
              btnClass = "bg-neo-pink text-black hover:bg-neo-pink/95 shadow-[3px_3px_0px_0px_#000]";
            }

            return (
              <div
                key={index}
                className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${cardClass}`}
              >
                <div>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                      <div className="flex items-center gap-1.5 px-4 py-1.5 bg-neo-yellow text-black border-2 border-black rounded-full text-[10px] font-mono font-extrabold uppercase tracking-widest shadow-[3px_3px_0px_0px_#000]">
                        <Sparkles className="size-3 text-black fill-black animate-pulse" />
                        Most Popular
                      </div>
                    </div>
                  )}

                  <div className="mb-8">
                    <span className={`inline-block px-3 py-1 border rounded-md text-[10px] font-mono font-bold uppercase tracking-wider mb-4 ${tagColor}`}>
                      {plan.name}
                    </span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className={`font-display text-4xl sm:text-5xl font-extrabold ${priceClass}`}>
                        {plan.price}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-muted-foreground mt-3 leading-relaxed">{plan.description}</p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm font-mono">
                        <Check
                          className={`size-4 mt-0.5 flex-shrink-0 ${isProfessional ? "text-neo-violet" : isStarter ? "text-neo-blue" : "text-neo-pink"
                            }`}
                        />
                        <span className="text-muted-foreground text-xs leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href="#contact"
                  className={`block w-full py-4 border-2 border-black rounded-xl font-mono font-extrabold text-xs uppercase tracking-widest text-center transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer ${btnClass}`}
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
