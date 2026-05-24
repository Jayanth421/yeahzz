import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "CEO, TechVenture India",
    avatar: "R",
    color: "bg-neo-blue text-black border-2 border-black",
    cardClass: "neo-card-blue",
    text: "Amazing service and premium website quality. Our online sales increased by 180% within two months of launch. The team understood our vision perfectly.",
    rating: 5,
  },
  {
    name: "Priya Patel",
    role: "Founder, StyleHub",
    avatar: "P",
    color: "bg-neo-violet text-white border-2 border-black",
    cardClass: "neo-card-violet",
    text: "Professional team with outstanding design and marketing strategy. Our brand presence has completely transformed. Highly recommended for any business looking to scale.",
    rating: 5,
  },
  {
    name: "Amit Kumar",
    role: "Director, BuildRight Realty",
    avatar: "A",
    color: "bg-neo-green text-black border-2 border-black",
    cardClass: "neo-card-green",
    text: "The website looks modern, loads incredibly fast, and helped us generate 3x more qualified leads. Their SEO work is exceptional.",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((c) => (c + 1) % testimonials.length);
  const prev = () =>
    setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-24 relative overflow-hidden bg-background">
      <div className="absolute top-0 right-0 size-[300px] bg-neo-blue/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 size-[300px] bg-neo-violet/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-neo-violet mb-4">
            [ 06 ] Testimonials
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold mb-4">
            What Our <span className="text-gradient">Clients</span> Say
          </h2>
        </div>

        {/* Desktop: all cards */}
        <div className="hidden md:grid grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className={`rounded-2xl p-8 transition-all duration-300 ${t.cardClass}`}
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star
                    key={j}
                    className="size-4 text-neo-yellow fill-neo-yellow"
                  />
                ))}
              </div>
              <p className="text-muted-foreground leading-relaxed mb-8 text-xs font-mono">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3">
                <div
                  className={`size-10 ${t.color} rounded-full flex items-center justify-center font-bold text-sm shadow-[2px_2px_0px_0px_#000]`}
                >
                  {t.avatar}
                </div>
                <div>
                  <div className="font-bold text-sm text-white">{t.name}</div>
                  <div className="text-xs text-muted-foreground font-mono">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: carousel */}
        <div className="md:hidden">
          <div className={`rounded-2xl p-8 ${testimonials[current].cardClass}`}>
            <div className="flex gap-1 mb-4">
              {Array.from({ length: testimonials[current].rating }).map(
                (_, j) => (
                  <Star
                    key={j}
                    className="size-4 text-neo-yellow fill-neo-yellow"
                  />
                )
              )}
            </div>
            <p className="text-muted-foreground leading-relaxed mb-8 text-xs font-mono">
              "{testimonials[current].text}"
            </p>
            <div className="flex items-center gap-3">
              <div
                className={`size-10 ${testimonials[current].color} rounded-full flex items-center justify-center font-bold text-sm shadow-[2px_2px_0px_0px_#000]`}
              >
                {testimonials[current].avatar}
              </div>
              <div>
                <div className="font-bold text-sm text-white">
                  {testimonials[current].name}
                </div>
                <div className="text-xs text-muted-foreground font-mono">
                  {testimonials[current].role}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={prev}
              className="p-3 bg-card border-2 border-black rounded-full hover:bg-neo-cream text-white hover:text-black shadow-[2px_2px_0px_0px_#000] transition-colors cursor-pointer"
            >
              <ChevronLeft className="size-5" />
            </button>
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <div
                  key={i}
                  className={`size-2 rounded-full transition-colors ${
                    i === current ? "bg-neo-blue" : "bg-white/20"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="p-3 bg-card border-2 border-black rounded-full hover:bg-neo-cream text-white hover:text-black shadow-[2px_2px_0px_0px_#000] transition-colors cursor-pointer"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
