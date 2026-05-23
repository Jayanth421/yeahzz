import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "CEO, TechVenture India",
    avatar: "R",
    color: "bg-neon-blue",
    text: "Amazing service and premium website quality. Our online sales increased by 180% within two months of launch. The team understood our vision perfectly.",
    rating: 5,
  },
  {
    name: "Priya Patel",
    role: "Founder, StyleHub",
    avatar: "P",
    color: "bg-neon-purple",
    text: "Professional team with outstanding design and marketing strategy. Our brand presence has completely transformed. Highly recommended for any business looking to scale.",
    rating: 5,
  },
  {
    name: "Amit Kumar",
    role: "Director, BuildRight Realty",
    avatar: "A",
    color: "bg-emerald-500",
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
    <section className="py-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 size-[300px] bg-neon-blue/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 size-[300px] bg-neon-purple/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-neon-purple mb-4">
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
              className="glass-card rounded-2xl p-8 hover:bg-white/[0.06] transition-all duration-300 glow-hover"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star
                    key={j}
                    className="size-4 text-amber-400 fill-amber-400"
                  />
                ))}
              </div>
              <p className="text-muted-foreground leading-relaxed mb-8 text-sm">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3">
                <div
                  className={`size-10 ${t.color} rounded-full flex items-center justify-center text-white font-bold text-sm`}
                >
                  {t.avatar}
                </div>
                <div>
                  <div className="font-bold text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: carousel */}
        <div className="md:hidden">
          <div className="glass-card rounded-2xl p-8">
            <div className="flex gap-1 mb-4">
              {Array.from({ length: testimonials[current].rating }).map(
                (_, j) => (
                  <Star
                    key={j}
                    className="size-4 text-amber-400 fill-amber-400"
                  />
                )
              )}
            </div>
            <p className="text-muted-foreground leading-relaxed mb-8 text-sm">
              "{testimonials[current].text}"
            </p>
            <div className="flex items-center gap-3">
              <div
                className={`size-10 ${testimonials[current].color} rounded-full flex items-center justify-center text-white font-bold text-sm`}
              >
                {testimonials[current].avatar}
              </div>
              <div>
                <div className="font-bold text-sm">
                  {testimonials[current].name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {testimonials[current].role}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={prev}
              className="p-2 glass-card rounded-full hover:bg-white/5 transition-colors"
            >
              <ChevronLeft className="size-5" />
            </button>
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <div
                  key={i}
                  className={`size-2 rounded-full transition-colors ${
                    i === current ? "bg-neon-blue" : "bg-white/20"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="p-2 glass-card rounded-full hover:bg-white/5 transition-colors"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
