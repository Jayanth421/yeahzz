import {
  Globe,
  ShoppingCart,
  Search,
  Megaphone,
  Palette,
  Smartphone,
} from "lucide-react";

const services = [
  {
    icon: Globe,
    title: "Web Development",
    description:
      "Custom business websites, landing pages, portfolios, and web applications built for speed and conversion.",
    color: "from-neon-blue to-cyan-400",
    bgColor: "bg-neon-blue/10",
    textColor: "text-neon-blue",
  },
  {
    icon: ShoppingCart,
    title: "eCommerce Development",
    description:
      "Modern online stores with payment integration, inventory management, and mobile-first optimization.",
    color: "from-neon-purple to-fuchsia-400",
    bgColor: "bg-neon-purple/10",
    textColor: "text-neon-purple",
  },
  {
    icon: Search,
    title: "SEO Optimization",
    description:
      "Rank websites higher on Google using advanced technical SEO, content strategy, and link building.",
    color: "from-emerald-400 to-teal-400",
    bgColor: "bg-emerald-500/10",
    textColor: "text-emerald-400",
  },
  {
    icon: Megaphone,
    title: "Digital Marketing",
    description:
      "Meta Ads, Google Ads, social media marketing, and lead generation campaigns that deliver ROI.",
    color: "from-amber-400 to-orange-400",
    bgColor: "bg-amber-500/10",
    textColor: "text-amber-400",
  },
  {
    icon: Palette,
    title: "Branding",
    description:
      "Logo design, visual identity systems, brand guidelines, and content strategy that tells your story.",
    color: "from-rose-400 to-pink-400",
    bgColor: "bg-rose-500/10",
    textColor: "text-rose-400",
  },
  {
    icon: Smartphone,
    title: "App Development",
    description:
      "Android and iOS app development for startups and businesses with modern cross-platform frameworks.",
    color: "from-violet-400 to-indigo-400",
    bgColor: "bg-violet-500/10",
    textColor: "text-violet-400",
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-neon-blue mb-4">
            [ 01 ] Core Capabilities
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold mb-4">
            Our <span className="text-gradient">Expertise</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            End-to-end digital solutions crafted with precision for modern brands that demand excellence.
          </p>
        </div>

        {/* Services grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="group glass-card rounded-2xl p-8 hover:bg-white/[0.06] transition-all duration-300 hover:scale-[1.02] cursor-default glow-hover"
              >
                <div
                  className={`size-14 ${service.bgColor} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className={`size-7 ${service.textColor}`} />
                </div>
                <h3 className="font-display text-xl font-bold mb-3 group-hover:text-neon-blue transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
                <div
                  className={`mt-6 h-0.5 w-0 group-hover:w-full bg-gradient-to-r ${service.color} rounded-full transition-all duration-500`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
