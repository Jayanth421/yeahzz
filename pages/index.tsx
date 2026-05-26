import Head from "next/head";
import Navbar from "../src/components/Navbar";
import HeroSection from "../src/components/HeroSection";
import ServicesSection from "../src/components/ServicesSection";
import AboutSection from "../src/components/AboutSection";
import WhyChooseUs from "../src/components/WhyChooseUs";
import PortfolioSection from "../src/components/PortfolioSection";
import PricingSection from "../src/components/PricingSection";
import TestimonialsSection from "../src/components/TestimonialsSection";
import WorkflowSection from "../src/components/WorkflowSection";
import FAQSection from "../src/components/FAQSection";
import ContactSection from "../src/components/ContactSection";
import Footer from "../src/components/Footer";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Yeahzz Digital Agency | Web Development &amp; Digital Marketing</title>
        <meta
          name="description"
          content="Premium web development and digital marketing agency. We create high-performance websites, branding systems, and campaigns that help businesses scale faster."
        />
        <meta property="og:title" content="Yeahzz Digital Agency | Web Development & Digital Marketing" />
        <meta
          property="og:description"
          content="Premium web development and digital marketing agency helping businesses scale with precision and impact."
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
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
    </>
  );
}
