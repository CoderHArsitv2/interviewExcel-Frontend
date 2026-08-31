"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  Sparkles,
  CheckCircle2,
  Star,
} from "lucide-react";

type Role = "student" | "expert";

const studentFeatures = [
  {
    tag: "1-on-1 Mentorship",
    title: "Master Your Next Big Interview",
    description:
      "Practice realistic mock interviews with senior engineers and hiring managers from Google, Amazon, Microsoft, and UPSC toppers.",
    highlight: "15k+ Interviews Completed",
  },
  {
    tag: "Actionable Feedback",
    title: "Detailed Rubric Scorecards",
    description:
      "Receive structured feedback on your coding speed, system design trade-offs, behavioral delivery, and personalized improvement roadmaps.",
    highlight: "98.4% Offer Conversion",
  },
  {
    tag: "Flexible Scheduling",
    title: "Book Whenever You Are Ready",
    description:
      "Choose from hundreds of verified domain mentors, pick an open calendar slot, and start practicing in our HD interactive studio.",
    highlight: "Zero Subscription Lock-In",
  },
];

const expertFeatures = [
  {
    tag: "Share Your Expertise",
    title: "Empower Future Tech Leaders",
    description:
      "Guide aspiring engineers, product managers, and civil servants through high-impact mock interviews and actionable coaching.",
    highlight: "500+ Verified Mentors",
  },
  {
    tag: "Monetize Your Time",
    title: "Set Your Own Rates & Hours",
    description:
      "Seamlessly sync your Google & Outlook calendars. Choose your own hourly consultation fees and receive instant payouts.",
    highlight: "Top Mentors Earn $2.5k+/mo",
  },
  {
    tag: "Expand Your Brand",
    title: "Build Your Reputation as an Industry Leader",
    description:
      "Grow your professional network, receive verified candidate reviews, and be recognized as a top domain authority.",
    highlight: "4.9★ Average Mentor Rating",
  },
];

interface LeftSectionProps {
  role: Role;
}

export const LeftSection: React.FC<LeftSectionProps> = ({ role }) => {
  const isStudent = role === "student";
  const features = isStudent ? studentFeatures : expertFeatures;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <div
      className={`hidden md:flex w-1/2 relative flex-col justify-between p-12 overflow-hidden text-white transition-all duration-500 ${
        isStudent
          ? "bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950"
          : "bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950"
      }`}
    >
      {/* Background Ambient Pastel Mesh Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sky-500/15 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* Brand Header */}
      <div className="relative z-10 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-11 h-11 rounded-2xl overflow-hidden shadow-lg shadow-purple-500/20 ring-2 ring-white/20 bg-white/10 flex items-center justify-center backdrop-blur-md group-hover:scale-105 transition-transform">
            <Image
              src="/mascot.png"
              alt="Interview Excel Mascot"
              fill
              className="object-cover p-1"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl tracking-tight text-white leading-none">
              Interview<span className="text-purple-300 font-extrabold">Excel</span>
            </span>
            <span className="text-[11px] font-medium text-purple-200/80 tracking-wide mt-0.5">
              {isStudent ? "Candidate Portal" : "Expert Mentor Portal"}
            </span>
          </div>
        </Link>

        {/* Role Pill */}
        <div
          className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${
            isStudent
              ? "bg-purple-500/20 text-purple-200 border-purple-400/30"
              : "bg-amber-500/20 text-amber-200 border-amber-400/30"
          }`}
        >
          {isStudent ? "🎯 Candidate Access" : "⭐ Verified Mentor"}
        </div>
      </div>

      {/* Center Showcase Card */}
      <div className="relative z-10 my-auto py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-6 max-w-lg"
          >
            {/* Feature Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-purple-200 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-purple-300 animate-pulse" />
              {features[current].tag}
            </div>

            {/* Headline */}
            <h2 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {features[current].title}
            </h2>

            {/* Description */}
            <p className="text-base text-purple-100/90 leading-relaxed font-normal">
              {features[current].description}
            </p>

            {/* Micro Highlight Pill */}
            <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{features[current].highlight}</span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Indicator Dots */}
        <div className="flex items-center gap-2 mt-8">
          {features.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                current === idx ? "w-8 bg-purple-300" : "w-2 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Social Proof Widget */}
      <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold ring-2 ring-purple-900 shadow">
              G
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold ring-2 ring-purple-900 shadow">
              A
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold ring-2 ring-purple-900 shadow">
              M
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-white">
              {isStudent ? "Mentors from FAANG & UPSC" : "Join Top Tech & Govt Mentors"}
            </p>
            <p className="text-[11px] text-purple-200/70">
              {isStudent ? "Google, Amazon, Meta, UPSC CSE" : "Global Leaders Mentoring 15k+ Candidates"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs font-bold text-amber-300 bg-white/10 px-2.5 py-1 rounded-xl border border-white/15">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>4.9★</span>
        </div>
      </div>
    </div>
  );
};

export default LeftSection;
