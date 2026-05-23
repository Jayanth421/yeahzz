import { useState } from "react";
import fintechImg from "../assets/portfolio-fintech.jpg";
import fashionImg from "../assets/portfolio-fashion.jpg";
import realestateImg from "../assets/portfolio-realestate.jpg";
import appImg from "../assets/portfolio-app.jpg";
import marketingImg from "../assets/portfolio-marketing.jpg";
import { ExternalLink } from "lucide-react";

const categories = ["All", "Website", "eCommerce", "Branding", "Marketing"];

const projects = [
  {
    title: "CryptoFlow Platform",
    category: "Website",
    image: fintechImg,
    tags: ["Web Development", "UX Design"],
  },
  {
    title: "Aura Couture",
    category: "eCommerce",
    image: fashionImg,
    tags: ["eCommerce", "Branding"],
  },
  {
    title: "LuxeHomes Realty",
    category: "Website",
    image: realestateImg,
    tags: ["Web Development", "SEO"],
  },
  {
    title: "FitTrack Pro",
    category: "Branding",
    image: appImg,
    tags: ["App Design", "Branding"],
  },
  {
    title: "GrowthScale Campaign",
    category: "Marketing",
    image: marketingImg,
    tags: ["Digital Marketing", "Analytics"],
  },
];

export default function PortfolioSection() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="portfolio" className="py-24 relative">
      <div className="absolute bottom-0 left-0 size-[400px] bg-neon-blue/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12">
          <div>
            <span className="inline-block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-neon-purple mb-4">
              [ 04 ] Our Work
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-extrabold mb-4">
              Featured <span className="text-gradient">Projects</span>
            </h2>
            <p className="text-muted-foreground max-w-lg">
              A curated selection of our best work across web development, eCommerce, and digital marketing.
            </p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                activeCategory === cat
                  ? "bg-gradient-to-r from-neon-blue to-neon-purple text-white"
                  : "glass-card text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project, index) => (
            <div
              key={index}
              className="group glass-card rounded-2xl overflow-hidden hover:bg-white/[0.06] transition-all duration-300 glow-hover"
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  width={1024}
                  height={640}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-5 bg-gradient-to-t from-background/80 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-white">
                    View Project <ExternalLink className="size-4" />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-bold mb-2 group-hover:text-neon-blue transition-colors">
                  {project.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 rounded-md bg-white/5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
