import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import Features from "./components/Features";
import CTASection from "./components/CTASection";

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
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Alice", review: "This platform transformed my learning experience!" },
              { name: "Bob", review: "Amazing content and super helpful mentors." },
              { name: "Charlie", review: "I improved my skills faster than I thought!" },
            ].map((t, i) => (
              <div key={i} className="p-6 bg-gray-100 rounded-xl shadow-md">
                <p className="text-gray-700 mb-4">"{t.review}"</p>
                <p className="font-semibold text-gray-900">- {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-sky-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Pricing Plans</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Basic", price: "$19/mo", features: ["Access to 5 courses", "Email support"] },
              { title: "Pro", price: "$49/mo", features: ["Access to 20 courses", "Priority support"] },
              { title: "Enterprise", price: "$99/mo", features: ["Unlimited courses", "Dedicated mentor"] },
            ].map((plan, i) => (
              <div key={i} className="p-6 bg-white rounded-xl shadow-md flex flex-col">
                <h3 className="text-xl font-bold mb-2">{plan.title}</h3>
                <p className="text-2xl font-semibold mb-4">{plan.price}</p>
                <ul className="mb-6 space-y-2">
                  {plan.features.map((f, idx) => (
                    <li key={idx} className="text-gray-700">• {f}</li>
                  ))}
                </ul>
                <button className="mt-auto bg-sky-600 text-white py-2 rounded-lg hover:bg-sky-700 transition">
                  Choose Plan
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog/Articles Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Latest Articles</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Top 10 Learning Tips", snippet: "Boost your productivity with these tips..." },
              { title: "How to Master React", snippet: "Step by step guide to becoming a React expert..." },
              { title: "Career in Tech", snippet: "Explore top tech roles and growth paths..." },
            ].map((blog, i) => (
              <div key={i} className="p-6 bg-gray-100 rounded-xl shadow-md">
                <h3 className="font-bold text-lg mb-2">{blog.title}</h3>
                <p className="text-gray-700">{blog.snippet}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 bg-sky-50">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">Our Trusted Partners</h2>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {["Logo1", "Logo2", "Logo3", "Logo4", "Logo5"].map((logo, i) => (
              <div key={i} className="w-32 h-16 bg-gray-200 flex items-center justify-center rounded-lg">
                {logo}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "How do I sign up?", a: "Click the Sign Up button and fill the form." },
              { q: "Can I change my plan later?", a: "Yes, you can upgrade or downgrade anytime." },
              { q: "Do you provide mentorship?", a: "Yes, our Pro and Enterprise plans include mentor support." },
            ].map((faq, i) => (
              <details key={i} className="p-4 border rounded-lg bg-gray-50">
                <summary className="font-semibold cursor-pointer">{faq.q}</summary>
                <p className="mt-2 text-gray-700">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <CTASection />
    </main>
  );
}
