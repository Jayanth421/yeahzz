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
    bgColor: "bg-neo-blue",
    textColor: "text-black",
    number: "[ 01 ]",
  },
  {
    icon: ShoppingCart,
    title: "eCommerce Development",
    description:
      "Modern online stores with payment integration, inventory management, and mobile-first optimization.",
    bgColor: "bg-neo-pink",
    textColor: "text-black",
    number: "[ 02 ]",
  },
  {
    icon: Search,
    title: "SEO Optimization",
    description:
      "Rank websites higher on Google using advanced technical SEO, content strategy, and link building.",
    bgColor: "bg-neo-green",
    textColor: "text-black",
    number: "[ 03 ]",
  },
  {
    icon: Megaphone,
    title: "Digital Marketing",
    description:
      "Meta Ads, Google Ads, social media marketing, and lead generation campaigns that deliver ROI.",
    bgColor: "bg-neo-yellow",
    textColor: "text-black",
    number: "[ 04 ]",
  },
  {
    icon: Palette,
    title: "Branding",
    description:
      "Logo design, visual identity systems, brand guidelines, and content strategy that tells your story.",
    bgColor: "bg-neo-violet",
    textColor: "text-white",
    number: "[ 05 ]",
  },
  {
    icon: Smartphone,
    title: "App Development",
    description:
      "Android and iOS app development for startups and businesses with modern cross-platform frameworks.",
    bgColor: "bg-neo-mint",
    textColor: "text-black",
    number: "[ 06 ]",
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-24 relative bg-background border-b-3 border-foreground">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16 max-w-xl mx-auto">
          <span className="inline-block px-3 py-1 bg-white border-2 border-black rounded-full font-mono text-[10px] font-extrabold uppercase tracking-widest text-neo-violet mb-4 shadow-[2px_2px_0px_0px_#000]">
            Capabilities
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold mb-4 text-foreground">
            Our Core <span className="underline decoration-neo-violet decoration-4">Expertise</span>
          </h2>
          <p className="text-muted-foreground text-sm font-mono leading-relaxed mt-3">
            End-to-end digital solutions crafted with precision for modern brands that demand high-performance execution.
          </p>
        </div>

        {/* Services grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            const isDarkCard = service.bgColor === "bg-neo-violet";
            return (
              <div
                key={index}
                className={`group border-3 border-black rounded-2xl p-8 shadow-[4px_4px_0px_0px_#000] hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[7px_7px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_#000] transition-all cursor-pointer ${service.bgColor} ${
                  isDarkCard ? "text-white" : "text-black"
                }`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-white border-2 border-black rounded-xl text-black shadow-[2px_2px_0px_0px_#000] group-hover:scale-105 transition-transform">
                    <Icon className="size-6" />
                  </div>
                  <span className="font-mono text-xs font-bold opacity-75">{service.number}</span>
                </div>
                
                <h3 className="font-display text-xl font-extrabold mb-3">
                  {service.title}
                </h3>
                
                <p className={`text-xs font-mono leading-relaxed ${isDarkCard ? "text-white/80" : "text-black/75"}`}>
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
