import { useState } from "react";
import { usePortfolio } from "../hooks/usePortfolio";
import { ExternalLink, RefreshCw } from "lucide-react";

import fintechImg from "../assets/portfolio-fintech.jpg";
import fashionImg from "../assets/portfolio-fashion.jpg";
import realestateImg from "../assets/portfolio-realestate.jpg";
import appImg from "../assets/portfolio-app.jpg";
import marketingImg from "../assets/portfolio-marketing.jpg";

const imageMap: Record<string, string> = {
  "src/assets/portfolio-fintech.jpg": fintechImg,
  "src/assets/portfolio-fashion.jpg": fashionImg,
  "src/assets/portfolio-realestate.jpg": realestateImg,
  "src/assets/portfolio-app.jpg": appImg,
  "src/assets/portfolio-marketing.jpg": marketingImg,
};

const getProjectImage = (path: string) => {
  if (imageMap[path]) return imageMap[path];
  return path;
};

const categories = ["All", "Website", "eCommerce", "Branding", "Marketing"];

export default function PortfolioSection() {
  const { projects, loading } = usePortfolio();
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="portfolio" className="py-24 relative bg-background border-b-3 border-foreground">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12">
          <div>
            <span className="inline-block px-3 py-1 bg-white border-2 border-black rounded-full font-mono text-[10px] font-extrabold uppercase tracking-widest text-neo-pink mb-4 shadow-[2px_2px_0px_0px_#000]">
              Our Projects
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-extrabold mb-4 text-foreground">
              Featured <span className="underline decoration-neo-pink decoration-4">Work</span>
            </h2>
            <p className="text-muted-foreground font-mono text-sm leading-relaxed max-w-lg">
              A curated selection of our best projects across web development, eCommerce, and digital branding.
            </p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 border-2 border-black rounded-xl text-xs font-mono font-extrabold uppercase tracking-wider transition-all cursor-pointer shadow-[2px_2px_0px_0px_#000] ${
                activeCategory === cat
                  ? "bg-neo-pink text-black translate-x-[-1px] translate-y-[-1px] shadow-[3px_3px_0px_0px_#000]"
                  : "bg-white text-black hover:bg-neo-cream"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <RefreshCw className="size-8 text-neo-pink animate-spin" />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((project, index) => (
              <div
                key={project.id || index}
                className="group bg-white dark:bg-card border-3 border-black rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px_#000] hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[7px_7px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_#000] transition-all cursor-pointer"
              >
                <div className="relative aspect-video overflow-hidden border-b-3 border-black bg-neo-cream">
                  <img
                    src={getProjectImage(project.image)}
                    alt={project.title}
                    width={1024}
                    height={640}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                  <div className="absolute inset-4 bg-black/80 border-2 border-black rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                    <div className="flex items-center gap-2 text-xs font-mono font-extrabold uppercase tracking-wider text-white bg-neo-pink px-4 py-2 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000]">
                      View Project <ExternalLink className="size-3.5" />
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-card text-card-foreground">
                  <h3 className="font-display text-lg font-extrabold mb-3 group-hover:text-neo-pink transition-colors">
                    {project.title}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 border border-black rounded-md text-[9px] font-mono font-bold uppercase tracking-wider bg-white text-black shadow-[1px_1px_0px_0px_#000]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
