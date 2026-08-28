"use client";

import {
  Users,
  Calendar,
  Video,
  Award,
  TrendingUp,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Users,
    title: "1-on-1 Expert Marketplace",
    description:
      "Connect directly with vetted engineers, hiring managers, and bureaucrats from top global organizations.",
    pastelBg: "bg-purple-100/80 dark:bg-purple-950/60",
    pastelBorder: "border-purple-200/80 dark:border-purple-800/40",
    iconColor: "text-purple-600 dark:text-purple-300",
    badge: "Verified Pros",
  },
  {
    icon: Calendar,
    title: "Smart Seamless Scheduling",
    description:
      "Instant timezone-aware slot booking directly synced with Google & Outlook calendars.",
    pastelBg: "bg-sky-100/80 dark:bg-sky-950/60",
    pastelBorder: "border-sky-200/80 dark:border-sky-800/40",
    iconColor: "text-sky-600 dark:text-sky-300",
    badge: "Real-Time Sync",
  },
  {
    icon: Video,
    title: "HD Interactive Studio",
    description:
      "Crystal clear low-latency video calls with shared code editors, whiteboards, and live question banks.",
    pastelBg: "bg-emerald-100/80 dark:bg-emerald-950/60",
    pastelBorder: "border-emerald-200/80 dark:border-emerald-800/40",
    iconColor: "text-emerald-600 dark:text-emerald-300",
    badge: "Integrated",
  },
  {
    icon: Award,
    title: "Rubric-Based Scorecards",
    description:
      "Receive structured feedback on coding efficiency, system architecture, leadership principles, and speech delivery.",
    pastelBg: "bg-amber-100/80 dark:bg-amber-950/60",
    pastelBorder: "border-amber-200/80 dark:border-amber-800/40",
    iconColor: "text-amber-600 dark:text-amber-300",
    badge: "Actionable",
  },
  {
    icon: TrendingUp,
    title: "Confidence & Growth Index",
    description:
      "Track your trajectory across practice sessions with granular analytics and personalized skill radar charts.",
    pastelBg: "bg-rose-100/80 dark:bg-rose-950/60",
    pastelBorder: "border-rose-200/80 dark:border-rose-800/40",
    iconColor: "text-rose-600 dark:text-rose-300",
    badge: "Deep Analytics",
  },
  {
    icon: ShieldCheck,
    title: "Confidential & Safe Space",
    description:
      "Encrypted sessions where you can make mistakes freely, practice tough questions, and refine your pitch.",
    pastelBg: "bg-teal-100/80 dark:bg-teal-950/60",
    pastelBorder: "border-teal-200/80 dark:border-teal-800/40",
    iconColor: "text-teal-600 dark:text-teal-300",
    badge: "100% Private",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="py-24 lg:py-32 bg-slate-50/70 dark:bg-slate-900/40 relative overflow-hidden transition-colors"
    >
      {/* Decorative Pastel Ambient Orbs */}
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-purple-200/20 dark:bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-emerald-200/20 dark:bg-emerald-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 lg:mb-20"
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-100 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800/40 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-purple-500" />
            Supercharged Preparation
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Everything You Need to <span className="text-gradient">Excel</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
            A comprehensive, mentor-led platform engineered to help you conquer challenging technical,
            managerial, and behavioral interview rounds.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((f, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              whileHover={{ y: -6 }}
              className="group relative p-8 rounded-3xl bg-white dark:bg-slate-900/80 border border-purple-100/70 dark:border-white/10 shadow-sm hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 backdrop-blur-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-inner ${f.pastelBg} ${f.pastelBorder} group-hover:scale-110 group-hover:rotate-2 transition-transform duration-300`}
                  >
                    <f.icon className={`h-7 w-7 ${f.iconColor}`} />
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
                    {f.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                  {f.title}
                </h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  {f.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-purple-50 dark:border-white/5 flex items-center text-xs font-semibold text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform">
                <span>Explore feature</span>
                <span className="ml-1">→</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
