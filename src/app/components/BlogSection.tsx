"use client";

import { ArrowRight, Calendar, Clock, BookOpen } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const blogs = [
  {
    title: "How to Structure System Design Answers for FAANG Rounds",
    snippet:
      "A step-by-step framework to navigate ambiguous requirements, calculate scale, and avoid common design traps...",
    date: "May 24, 2026",
    readTime: "6 min read",
    category: "System Design",
    pastelTag:
      "bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/40",
    gradient: "from-purple-400/20 to-indigo-500/20",
  },
  {
    title: "Mastering the UPSC Personality Test: Insights from Rank Holders",
    snippet:
      "Direct advice on handling hypothetical ethical dilemmas, remaining balanced, and projecting authentic conviction...",
    date: "Jun 02, 2026",
    readTime: "8 min read",
    category: "Civil Services",
    pastelTag:
      "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40",
    gradient: "from-emerald-400/20 to-teal-500/20",
  },
  {
    title: "The Behavioral STAR Method: Real Examples That Actually Win Offers",
    snippet:
      "Transforming ordinary work experiences into compelling stories that demonstrate leadership and cross-functional impact...",
    date: "Jun 18, 2026",
    readTime: "5 min read",
    category: "Behavioral",
    pastelTag:
      "bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800/40",
    gradient: "from-sky-400/20 to-blue-500/20",
  },
];

export default function BlogSection() {
  return (
    <section
      id="blog"
      className="py-24 lg:py-32 bg-slate-50/60 dark:bg-slate-900/40 relative overflow-hidden transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6"
        >
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sky-100 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800/40 text-sky-700 dark:text-sky-300 text-xs font-bold uppercase tracking-wider mb-4">
              <BookOpen className="w-3.5 h-3.5 text-sky-500" />
              Interview Playbooks
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
              Proven <span className="text-gradient">Strategies & Guides</span>
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl">
              Deep dives, question breakdowns, and battle-tested roadmaps curated by senior interviewers.
            </p>
          </div>

          <Button
            variant="outline"
            className="hidden md:flex gap-2 rounded-2xl border-purple-200/80 dark:border-white/10 hover:bg-purple-50 dark:hover:bg-slate-800 font-semibold"
          >
            Explore All Guides <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
          {blogs.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="group bg-white dark:bg-slate-900/80 border border-purple-100/80 dark:border-white/10 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Visual Header Tile */}
                <div
                  className={`h-48 bg-gradient-to-br ${b.gradient} relative overflow-hidden flex items-center justify-center p-6`}
                >
                  <div className="absolute inset-0 bg-white/20 dark:bg-black/20 backdrop-blur-[2px]" />
                  <div className="absolute top-4 left-4">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full border shadow-sm ${b.pastelTag}`}
                    >
                      {b.category}
                    </span>
                  </div>
                  <BookOpen className="w-12 h-12 text-purple-600/40 dark:text-purple-300/40 group-hover:scale-110 transition-transform duration-500" />
                </div>

                <div className="p-6 sm:p-7">
                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {b.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {b.readTime}
                    </div>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors leading-snug">
                    {b.title}
                  </h3>

                  <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed mb-6">
                    {b.snippet}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-0 sm:px-7 sm:pb-7">
                <Link
                  href="#"
                  className="inline-flex items-center text-sm font-bold text-purple-600 dark:text-purple-400 group-hover:gap-2 transition-all"
                >
                  Read Article <ArrowRight className="w-4 h-4 ml-1.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Button variant="outline" className="w-full rounded-2xl border-purple-200 dark:border-slate-800">
            Explore All Guides
          </Button>
        </div>
      </div>
    </section>
  );
}
