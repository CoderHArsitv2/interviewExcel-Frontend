"use client";

import { useState } from "react";
import { Plus, Minus, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    q: "How does 1-on-1 mock interview booking work?",
    a: "Select your target role (Software Engineering, System Design, PM, UPSC, etc.), browse verified mentors from Google, Amazon, Microsoft, or top institutions, choose an available slot that fits your schedule, and receive instant calendar and video meeting links.",
  },
  {
    q: "Are the mentors actual interviewers?",
    a: "Yes. Every mentor on InterviewExcel is rigorously vetted. They are currently active software engineers, tech leads, engineering managers, and past rank-holders who have conducted dozens of real hiring loops.",
  },
  {
    q: "What kind of feedback do I receive after a session?",
    a: "Immediately following the session, your mentor provides a comprehensive scorecard grading your problem-solving speed, code cleanliness, communication, edge-case analysis, and structural articulation, along with a personalized improvement roadmap.",
  },
  {
    q: "Can I reschedule or cancel if something comes up?",
    a: "Yes, you can easily reschedule or cancel your session up to 24 hours prior to the start time with a full credit refund directly from your dashboard.",
  },
  {
    q: "Do you support behavioral and leadership rounds?",
    a: "Absolutely. We offer dedicated sessions for Amazon Leadership Principles, Google Googlyness, behavioral STAR storytelling, and executive communication rounds.",
  },
];

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="py-24 lg:py-32 bg-white dark:bg-slate-950 relative overflow-hidden transition-colors"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 lg:mb-20"
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-100 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800/40 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider mb-4">
            <HelpCircle className="w-3.5 h-3.5 text-purple-500" />
            Got Questions?
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
            Everything you need to know about preparing with top industry mentors.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = activeIndex === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className={`rounded-3xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "bg-purple-50/60 dark:bg-slate-900/90 border-purple-300/80 dark:border-purple-800/60 shadow-lg shadow-purple-500/5"
                    : "bg-slate-50/70 dark:bg-slate-900/40 border-purple-100/60 dark:border-white/5 hover:border-purple-200 dark:hover:border-purple-900/40"
                }`}
              >
                <button
                  onClick={() => setActiveIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between p-6 sm:p-7 text-left gap-4"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {faq.q}
                  </span>
                  <div
                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isOpen
                        ? "bg-purple-600 text-white rotate-180"
                        : "bg-purple-100 dark:bg-slate-800 text-purple-700 dark:text-purple-300"
                    }`}
                  >
                    {isOpen ? (
                      <Minus className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-6 sm:px-7 sm:pb-7 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed pt-0 border-t border-purple-100/50 dark:border-white/5 mt-2">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
