"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function CTASection() {
  return (
    <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-slate-50/70 dark:bg-slate-900/40 relative overflow-hidden transition-colors">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-[2.5rem] p-8 sm:p-14 lg:p-16 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white shadow-2xl shadow-purple-900/25 overflow-hidden text-center"
        >
          {/* Background Pastel & Glow Mesh Shapes */}
          <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-pink-400/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-sky-400/20 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/3" />
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-white/20 text-white text-xs sm:text-sm font-semibold backdrop-blur-md mb-6">
              <Sparkles className="w-4 h-4 text-purple-200 animate-pulse" />
              Transform Nervousness into Offers
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight">
              Ready to Excel in Your Next Interview?
            </h2>

            <p className="text-base sm:text-xl text-purple-100 mb-10 max-w-2xl mx-auto leading-relaxed font-normal">
              Book a live 1-on-1 session with a mentor from your dream company today. Receive immediate feedback, structured advice, and the confidence to stand out.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/student/auth" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-14 px-9 text-base sm:text-lg font-bold bg-white text-purple-900 hover:bg-purple-50 rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
                >
                  Start Practicing Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/expert/auth" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto h-14 px-8 text-base sm:text-lg font-semibold border-2 border-white/40 text-white hover:bg-white/15 rounded-2xl bg-transparent backdrop-blur-md transition-all"
                >
                  Join as a Mentor
                </Button>
              </Link>
            </div>

            {/* Bottom Trust Indicators */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-purple-200 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Zero Subscription Lock-In</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>100% Satisfaction Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-300" />
                <span>Instant Slot Confirmation</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
