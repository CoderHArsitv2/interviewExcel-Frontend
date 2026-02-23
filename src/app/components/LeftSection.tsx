"use client";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import React, { useEffect, useState } from "react";

type Role = "student" | "expert";

const studentFeatures = [
  {
    title: "Welcome Back!",
    description: "Sign in to continue your learning journey with us.",
  },
  {
    title: "Stay Connected",
    description: "Access your courses and progress anytime, anywhere.",
  },
  {
    title: "Learn Smarter",
    description: "Get personalized recommendations for faster growth.",
  },
];

const expertFeatures = [
  {
    title: "Welcome Mentor!",
    description: "Sign in to connect with students and share your expertise.",
  },
  {
    title: "Grow Your Network",
    description: "Build credibility and expand your professional reach.",
  },
  {
    title: "Make an Impact",
    description: "Guide learners and help them achieve their career goals.",
  },
];

interface LeftSectionProps {
  role: Role;
}

export const LeftSection: React.FC<LeftSectionProps> = ({ role }) => {
  const features = role === "student" ? studentFeatures : expertFeatures;

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-600 to-purple-800 text-white flex-col items-center justify-center relative overflow-hidden">
      {/* Decorative Blob */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      {/* Brand Header */}
      <div className="absolute top-8 left-8 flex items-center gap-3">
        <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.2)] ring-2 ring-white/20 bg-white/10">
          <Image
            src="/mascot.png"
            alt="Interview Excel Mascot"
            fill
            className="object-cover p-1"
          />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-xl tracking-tight text-white leading-none">
            Interview
          </span>
          <span className="font-bold text-xl tracking-tight text-blue-300 leading-none">
            Excel
          </span>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center w-full z-10 px-8">
        <div className="relative w-64 h-64 mb-12">
          {/* Glow behind the main image */}
          <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full" />
          <Image
            src="/mascot.png"
            alt="Welcome Mascot"
            fill
            className="object-contain relative z-10 drop-shadow-2xl"
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center max-w-md"
          >
            <h2 className="text-4xl font-extrabold mb-4 tracking-tight leading-tight">
              {features[current].title}
            </h2>
            <p className="text-lg text-blue-100 font-medium leading-relaxed">
              {features[current].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LeftSection;
