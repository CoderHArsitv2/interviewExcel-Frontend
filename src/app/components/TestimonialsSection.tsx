"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "Software Engineer at Google",
    review: "The mock interviews were incredibly realistic. The feedback I received was spot on and helped me crack the L4 interview!",
    rating: 5,
    image: "/avatars/sarah.jpg" // Placeholder
  },
  {
    name: "Rahul Sharma",
    role: "UPSC CSE Rank 45",
    review: "InterviewExcel connected me with retired bureaucrats who gave me invaluable insights into the personality test.",
    rating: 5,
    image: "/avatars/rahul.jpg"
  },
  {
    name: "Emily Chen",
    role: "Product Manager at Stripe",
    review: "I was struggling with system design rounds. The mentors here broke it down simply. Highly recommended!",
    rating: 5,
    image: "/avatars/emily.jpg"
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Loved by <span className="text-blue-600">Thousands</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See what our successful students have to say about their journey with us.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-gray-50 rounded-2xl p-8 relative hover:shadow-lg transition-shadow"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-blue-100" />

              <div className="flex gap-1 mb-6">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-gray-700 text-lg mb-8 leading-relaxed">
                &quot;{t.review}&quot;
              </p>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden relative">
                  {/* Placeholder for avatar */}
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold text-lg">
                    {t.name[0]}
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{t.name}</h4>
                  <p className="text-sm text-gray-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
