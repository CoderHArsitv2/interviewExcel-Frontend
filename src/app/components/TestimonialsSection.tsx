"use client";

import { Star, Quote, Sparkles, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "L4 Software Engineer",
    company: "Google",
    pastelTag: "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40",
    avatarBg: "from-emerald-400 to-teal-500",
    review:
      "The mock interviews were 100% true to the actual Google loop. The detailed rubric feedback on system design and edge-case handling was the single reason I converted my offer!",
    rating: 5,
    highlight: "Cracked Google L4 in 3 weeks",
  },
  {
    name: "Rahul Sharma",
    role: "IAS Officer (Rank 45)",
    company: "UPSC CSE",
    pastelTag: "bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/40",
    avatarBg: "from-purple-400 to-indigo-500",
    review:
      "Practicing the personality test with retired senior civil servants gave me unmatched clarity on current affairs articulation and stress management. Indispensable!",
    rating: 5,
    highlight: "Scored 198 in UPSC Interview",
  },
  {
    name: "Emily Chen",
    role: "Senior Product Manager",
    company: "Stripe",
    pastelTag: "bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800/40",
    avatarBg: "from-sky-400 to-blue-500",
    review:
      "I was struggling with execution and product metrics rounds. The mentor stripped away all the unnecessary jargon and gave me a crystal clear framework to structure my answers.",
    rating: 5,
    highlight: "Negotiated +35% Compensation",
  },
];

export default function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      className="py-24 lg:py-32 bg-white dark:bg-slate-950 relative overflow-hidden transition-colors"
    >
      {/* Background Pastel Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-r from-purple-100/30 via-pink-100/20 to-sky-100/30 dark:from-purple-950/20 dark:via-pink-950/10 dark:to-sky-950/20 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 lg:mb-20"
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            Verified Success Stories
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Loved by <span className="text-gradient">Thousands of Candidates</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
            Real outcomes from students who turned their interview anxiety into dream offers.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="relative rounded-3xl p-8 bg-slate-50/80 dark:bg-slate-900/70 border border-purple-100/80 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-300 backdrop-blur-md flex flex-col justify-between group"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-purple-200/60 dark:text-purple-900/40 pointer-events-none" />

              <div>
                {/* Rating & Highlight Pill */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex gap-1">
                    {[...Array(t.rating)].map((_, idx) => (
                      <Star
                        key={idx}
                        className="w-4 h-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${t.pastelTag}`}
                  >
                    {t.company}
                  </span>
                </div>

                {/* Highlight Quote */}
                <div className="mb-4 text-xs font-bold text-purple-700 dark:text-purple-300">
                  ★ {t.highlight}
                </div>

                {/* Review Text */}
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed mb-6 font-normal">
                  &ldquo;{t.review}&rdquo;
                </p>
              </div>

              {/* User Info */}
              <div className="pt-4 border-t border-purple-100/80 dark:border-white/10 flex items-center gap-3.5">
                <div
                  className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${t.avatarBg} flex items-center justify-center text-white font-bold text-base shadow-md`}
                >
                  {t.name[0]}
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-1.5">
                    {t.name}
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 inline" />
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {t.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
