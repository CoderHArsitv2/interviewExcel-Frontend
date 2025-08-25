"use client";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const features = [
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

export const LeftSection = () => {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="hidden md:flex w-1/2 bg-sky-900 text-white flex-col items-center relative overflow-hidden">
      <div>
        <Image
          src="/interview_excel.png"
          alt="Signup Illustration"
          width={200}
          height={200}
          className="right-10 justify-center mt-10"
        ></Image>
      </div>
      <div className="inset-0 flex items-center justify-center p-25 mt-20">
        <Image
          src="/mascot.png"
          alt="Signup Illustration"
          width={200}
          height={200}
          className="top-10 right-10"
        ></Image>
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-md p-8"
          >
            <h2 className="text-3xl font-bold mb-4">
              {features[current].title}
            </h2>
            <p className="text-lg opacity-90">
              {features[current].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LeftSection;
