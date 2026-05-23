import { createFileRoute } from "@tanstack/react-router";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import ServicesSection from "../components/ServicesSection";
import AboutSection from "../components/AboutSection";
import WhyChooseUs from "../components/WhyChooseUs";
import PortfolioSection from "../components/PortfolioSection";
import PricingSection from "../components/PricingSection";
import TestimonialsSection from "../components/TestimonialsSection";
import WorkflowSection from "../components/WorkflowSection";
import FAQSection from "../components/FAQSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        title:
          "Lumina Digital Agency | Web Development & Digital Marketing",
      },
      {
        name: "description",
        content:
          "Premium web development and digital marketing agency. We create high-performance websites, branding systems, and campaigns that help businesses scale faster.",
      },
      {
        property: "og:title",
        content: "Lumina Digital Agency | Web Development & Digital Marketing",
      },
      {
        property: "og:description",
        content:
          "Premium web development and digital marketing agency helping businesses scale with precision and impact.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <AboutSection />
        <WhyChooseUs />
        <PortfolioSection />
        <PricingSection />
        <TestimonialsSection />
        <WorkflowSection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
