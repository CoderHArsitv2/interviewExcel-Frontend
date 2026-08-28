import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import Features from "./components/Features";
import CTASection from "./components/CTASection";
import TestimonialsSection from "./components/TestimonialsSection";
import BlogSection from "./components/BlogSection";
import PartnersSection from "./components/PartnersSection";
import FAQSection from "./components/FAQSection";
import Footer from "./components/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
      {/* Top Navbar */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Partners Marquee */}
      <PartnersSection />

      {/* Features Section */}
      <Features />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Blog/Articles Section */}
      <BlogSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Call To Action */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </main>
  );
}
