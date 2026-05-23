import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How long does website development take?",
    answer:
      "Typically 5–20 days depending on complexity. A simple landing page can be ready in 5 days, while a full eCommerce website or web app may take 2–3 weeks. We always provide a clear timeline before starting.",
  },
  {
    question: "Do you provide SEO and digital marketing services?",
    answer:
      "Yes, we offer complete SEO and digital marketing solutions including on-page SEO, technical SEO, content strategy, Google Ads, Meta Ads, and social media marketing. Every website we build is SEO-optimized from the ground up.",
  },
  {
    question: "Can you redesign existing websites?",
    answer:
      "Absolutely. We specialize in redesigning and optimizing existing websites to improve performance, user experience, and conversion rates. We'll audit your current site and propose a modernization plan.",
  },
  {
    question: "Do you provide ongoing support after launch?",
    answer:
      "Yes, all our plans include support. Starter plans include 7 days of support, Professional includes 30 days, and Enterprise includes priority 24/7 support. We also offer monthly maintenance packages.",
  },
  {
    question: "What technologies do you use?",
    answer:
      "We use modern, future-proof technologies including React, Next.js, Tailwind CSS, Node.js, and Express. For eCommerce, we work with Shopify, WooCommerce, and custom solutions. Our stack ensures speed, scalability, and security.",
  },
  {
    question: "Do you offer payment plans?",
    answer:
      "Yes, we offer flexible payment plans. Typically 50% upfront and 50% on delivery. For larger Enterprise projects, we can arrange milestone-based payments. Contact us to discuss what works best for your business.",
  },
];

function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="glass-card rounded-xl overflow-hidden transition-all duration-300">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-white/[0.03] transition-colors"
      >
        <span className="font-display font-bold text-sm sm:text-base pr-4">
          {question}
        </span>
        <ChevronDown
          className={`size-5 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="px-6 pb-6 text-sm text-muted-foreground leading-relaxed">
          {answer}
        </div>
      </div>
    </div>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 relative">
      <div className="absolute top-0 left-0 size-[400px] bg-neon-purple/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-neon-blue mb-4">
            [ 08 ] FAQ
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold mb-4">
            Common <span className="text-gradient">Questions</span>
          </h2>
          <p className="text-muted-foreground">
            Everything you need to know before getting started.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
