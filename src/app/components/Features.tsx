"use client";

import { Users, Calendar, Video, Award, TrendingUp, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Users,
    title: "Expert Marketplace",
    description: "Connect with verified mentors from top companies and institutions.",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: Calendar,
    title: "Flexible Scheduling",
    description: "Book sessions at your convenience with our easy-to-use calendar.",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: Video,
    title: "Integrated Video Calls",
    description: "Seamless interview experience with built-in high-quality video.",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: Award,
    title: "Personalized Feedback",
    description: "Get detailed, actionable feedback to improve your performance.",
    color: "bg-orange-100 text-orange-600",
  },
  {
    icon: TrendingUp,
    title: "Track Progress",
    description: "Monitor your growth with detailed analytics and confidence scores.",
    color: "bg-pink-100 text-pink-600",
  },
  {
    icon: ShieldCheck,
    title: "Secure Platform",
    description: "Your data and sessions are fully encrypted and secure.",
    color: "bg-teal-100 text-teal-600",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-gray-50 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Everything You Need to <span className="text-gradient">Succeed</span>
          </h2>
          <p className="text-xl text-gray-600">
            Our platform provides all the tools and resources to help you crack your dream interview.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group"
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${f.color} group-hover:scale-110 transition-transform duration-300`}>
                <f.icon className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
              <p className="text-gray-600 leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
