"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Video, Mic, MonitorUp, PhoneOff } from "lucide-react";
import Image from "next/image";

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
          className="flex-1 relative w-full lg:w-auto mt-12 lg:mt-0"
        >
          {/* Main Video Call Window */}
          <div className="relative z-10 bg-slate-900 rounded-[2rem] p-4 shadow-2xl border border-slate-800/60 rotate-2 hover:rotate-0 transition-all duration-500 overflow-hidden ring-4 ring-white/50">
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400 bg-slate-800 rounded-full px-3 py-1">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                00:45:22
              </div>
            </div>

            <div className="relative rounded-[1.5rem] overflow-hidden bg-slate-800 aspect-[4/3] group shadow-inner">
              {/* Expert Video (Big Video) */}
              <div className="absolute inset-0 w-full h-full">
                <Image
                  src="/profile.jpg"
                  alt="Expert Mentor"
                  fill
                  className="object-cover object-top opacity-90 transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
              </div>

              {/* Expert Name Tag */}
              <div className="absolute bottom-6 left-6 flex items-center gap-3">
                <div className="bg-black/40 backdrop-blur-md border border-white/10 text-white text-sm font-semibold px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                  Sarah (Google SWE)
                </div>
              </div>

              {/* Student Video (Small Floating Video) */}
              <div className="absolute bottom-6 right-6 w-32 h-40 md:w-40 md:h-52 bg-slate-700 rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl transform transition-transform hover:scale-105">
                <Image
                  src="/mascot.png"
                  alt="Student Mascot"
                  fill
                  className="object-cover bg-white/5 p-2"
                />
                <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-md rounded-lg px-2 py-1 flex items-center gap-1">
                  <Mic className="w-3 h-3 text-white" />
                  <span className="text-[10px] text-white font-medium">You</span>
                </div>
              </div>

              {/* Video Call Controls */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:-translate-y-6 transition-all duration-300">
                <div className="flex items-center gap-3 bg-black/50 backdrop-blur-lg border border-white/10 p-2 rounded-2xl shadow-2xl">
                  <button className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-white transition-colors">
                    <Mic className="w-5 h-5" />
                  </button>
                  <button className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-white transition-colors">
                    <Video className="w-5 h-5" />
                  </button>
                  <button className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-white transition-colors">
                    <MonitorUp className="w-5 h-5" />
                  </button>
                  <button className="p-3 bg-red-500 hover:bg-red-600 rounded-xl text-white transition-colors shadow-lg shadow-red-500/30">
                    <PhoneOff className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative floating elements */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-6 -right-6 md:-right-12 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 z-20"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-50 rounded-full flex items-center justify-center border border-green-200 shadow-inner">
                <span className="text-xl font-bold bg-gradient-to-br from-green-600 to-emerald-600 bg-clip-text text-transparent">A+</span>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Excellent Start!</p>
                <div className="flex items-center gap-1 mt-1">
                  <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-full" />
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">100%</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 6, delay: 1, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-10 -left-6 md:-left-12 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 z-20"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Feedback Added</p>
                <p className="text-xs text-slate-500">&ldquo;Great technical depth&rdquo;</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
