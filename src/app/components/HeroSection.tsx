"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-white -z-20" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/4" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-3xl -z-10 -translate-x-1/3 translate-y-1/4" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12">
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            #1 Platform for Mock Interviews
          </div>

          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-gray-900 leading-[1.1] mb-6">
            Master Your <br />
            <span className="text-gradient">Dream Interview</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            Connect with top mentors from Google, Amazon, and UPSC toppers.
            Get real-time feedback, personalized roadmaps, and boost your confidence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link href="/student/auth">
              <Button size="lg" className="h-12 px-8 text-lg rounded-full shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all">
                Start Learning
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/expert/auth">
              <Button variant="outline" size="lg" className="h-12 px-8 text-lg rounded-full border-2 hover:bg-gray-50">
                Become a Mentor
              </Button>
            </Link>
          </div>

          <div className="mt-10 flex items-center justify-center lg:justify-start gap-6 text-sm text-gray-500 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Verified Experts</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>100% Satisfaction</span>
            </div>
          </div>
        </motion.div>

        {/* Hero Image / Illustration */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="flex-1 relative"
        >
          <div className="relative z-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-3xl p-1 shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
            <div className="bg-white rounded-[22px] overflow-hidden h-[400px] lg:h-[500px] flex items-center justify-center bg-grid-slate-100">
              {/* Placeholder for Hero Image - using a gradient div for now */}
              <div className="text-center p-8">
                <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">🚀</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Mock Interview Session</h3>
                <p className="text-gray-500">Live video call with industry experts</p>

                {/* Fake UI Elements */}
                <div className="mt-8 space-y-3 max-w-xs mx-auto">
                  <div className="h-2 bg-gray-100 rounded-full w-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-3/4 rounded-full" />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Confidence Score</span>
                    <span>85%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative floating elements */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-10 -right-10 bg-white p-4 rounded-2xl shadow-xl z-20 hidden md:block"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">A+</div>
              <div>
                <p className="text-sm font-bold text-gray-800">Excellent!</p>
                <p className="text-xs text-gray-500">Feedback received</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

