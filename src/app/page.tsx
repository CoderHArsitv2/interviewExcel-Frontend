import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import Features from "./components/Features";
import CTASection from "./components/CTASection";
import TestimonialsSection from "./components/TestimonialsSection";
import PricingSection from "./components/PricingSection";
import BlogSection from "./components/BlogSection";
import PartnersSection from "./components/PartnersSection";
import FAQSection from "./components/FAQSection";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navbar */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <Features />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Pricing Section */}
      <PricingSection />

      {/* Blog/Articles Section */}
      <BlogSection />

      {/* Partners Section */}
      <PartnersSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Call To Action */}
      <CTASection />
    </main>
  );
}
