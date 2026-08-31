"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Star,
  Zap,
  Award,
  Code2,
  Landmark,
  Briefcase,
  Building2,
  Brain,
  Volume2,
  Mic,
} from "lucide-react";
import { useHeroAnimation } from "@/animations";

interface TrackData {
  id: string;
  name: string;
  shortLabel: string;
  icon: typeof Code2;
  color: string;
  pastelBg: string;
  pastelBorder: string;
  badgeColor: string;
  targetOrgs: string[];
  roundsCovered: string[];
  mockCriteria: { label: string; score: string; percent: number }[];
  mentorTitle: string;
  feedbackQuote: string;
  recommendation: string;
}

const tracks: TrackData[] = [
  {
    id: "sde",
    name: "Software Engineering (SDE)",
    shortLabel: "SDE & Tech",
    icon: Code2,
    color: "text-purple-600 dark:text-purple-300",
    pastelBg: "bg-purple-50/80 dark:bg-purple-950/40",
    pastelBorder: "border-purple-200 dark:border-purple-800/60",
    badgeColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-200",
    targetOrgs: ["Google", "Amazon", "Microsoft", "Meta", "Stripe"],
    roundsCovered: ["Data Structures & Algorithms", "System Design", "Low-Level Design", "Hiring Manager"],
    mockCriteria: [
      { label: "Data Structures & Optimization", score: "10 / 10", percent: 100 },
      { label: "Scalable System Architecture", score: "9.8 / 10", percent: 98 },
      { label: "Technical Articulation", score: "9.9 / 10", percent: 99 },
    ],
    mentorTitle: "Staff SWE @ Google",
    feedbackQuote: "“Clean O(1) eviction logic and great trade-off justification on latency vs. consistency.”",
    recommendation: "STRONG HIRE (L5)",
  },
  {
    id: "upsc",
    name: "UPSC & Civil Services",
    shortLabel: "UPSC CSE",
    icon: Landmark,
    color: "text-amber-600 dark:text-amber-300",
    pastelBg: "bg-amber-50/80 dark:bg-amber-950/40",
    pastelBorder: "border-amber-200 dark:border-amber-800/60",
    badgeColor: "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-200",
    targetOrgs: ["IAS", "IPS", "IFS", "State PSCs"],
    roundsCovered: ["Personality Test (PT)", "DAF In-Depth Review", "Current Affairs Articulation", "Stress Management"],
    mockCriteria: [
      { label: "Balanced & Nuanced Opinions", score: "10 / 10", percent: 100 },
      { label: "DAF & Background Fluency", score: "9.9 / 10", percent: 99 },
      { label: "Composure & Body Language", score: "9.7 / 10", percent: 97 },
    ],
    mentorTitle: "Retired IAS & Board Panelist",
    feedbackQuote: "“Balanced stance on fiscal federalism without taking extreme ideological biases. Very well delivered.”",
    recommendation: "BOARD SCORE: 195+",
  },
  {
    id: "pm",
    name: "Product Management (PM)",
    shortLabel: "Product (PM)",
    icon: Briefcase,
    color: "text-sky-600 dark:text-sky-300",
    pastelBg: "bg-sky-50/80 dark:bg-sky-950/40",
    pastelBorder: "border-sky-200 dark:border-sky-800/60",
    badgeColor: "bg-sky-100 text-sky-700 dark:bg-sky-900/60 dark:text-sky-200",
    targetOrgs: ["Uber", "Airbnb", "Netflix", "Atlassian", "CRED"],
    roundsCovered: ["Product Sense & Design", "Root Cause Analysis", "Metrics & North Star", "GTM Strategy"],
    mockCriteria: [
      { label: "User Empathy & Problem Definition", score: "9.9 / 10", percent: 99 },
      { label: "Metrics & Trade-off Prioritization", score: "9.7 / 10", percent: 97 },
      { label: "Strategic Leadership", score: "9.8 / 10", percent: 98 },
    ],
    mentorTitle: "Director of Product @ Uber",
    feedbackQuote: "“Excellent customer segmentation and sharp prioritization framework for the MVP rollout.”",
    recommendation: "STRONG HIRE (Senior PM)",
  },
  {
    id: "banking",
    name: "Banking & Finance Exams",
    shortLabel: "Banking & Govt",
    icon: Building2,
    color: "text-emerald-600 dark:text-emerald-300",
    pastelBg: "bg-emerald-50/80 dark:bg-emerald-950/40",
    pastelBorder: "border-emerald-200 dark:border-emerald-800/60",
    badgeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-200",
    targetOrgs: ["RBI Grade B", "SBI PO", "IBPS PO", "NABARD", "SEBI"],
    roundsCovered: ["Banking Awareness", "Monetary Policy Analysis", "Personal Interview", "Group Discussion"],
    mockCriteria: [
      { label: "Banking & Financial Awareness", score: "9.8 / 10", percent: 98 },
      { label: "Macro-Economic Fluency", score: "9.9 / 10", percent: 99 },
      { label: "Interview Panel Presence", score: "9.6 / 10", percent: 96 },
    ],
    mentorTitle: "Ex-RBI General Manager",
    feedbackQuote: "“Precise understanding of Repo Rate transmission and liquidity management tools.”",
    recommendation: "EXEMPLARY PANEL RATING",
  },
  {
    id: "ai",
    name: "AI & Data Science",
    shortLabel: "AI & Data",
    icon: Brain,
    color: "text-rose-600 dark:text-rose-300",
    pastelBg: "bg-rose-50/80 dark:bg-rose-950/40",
    pastelBorder: "border-rose-200 dark:border-rose-800/60",
    badgeColor: "bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-200",
    targetOrgs: ["OpenAI", "NVIDIA", "DeepMind", "Microsoft Research"],
    roundsCovered: ["ML System Design", "Statistics & Probability", "Python / PyTorch Coding", "LLM Evaluation"],
    mockCriteria: [
      { label: "Model Architecture & Scaling", score: "9.9 / 10", percent: 99 },
      { label: "Loss Function & Optimization", score: "9.8 / 10", percent: 98 },
      { label: "Data Pipeline & Latency", score: "9.7 / 10", percent: 97 },
    ],
    mentorTitle: "Staff ML Engineer @ OpenAI",
    feedbackQuote: "“Great choice of retrieval pipeline and prompt caching to reduce inference latency by 40%.”",
    recommendation: "STRONG HIRE (Staff AI)",
  },
];

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const ctaGroupRef = useRef<HTMLDivElement>(null);
  const trustBarRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);
  const cardFloat1Ref = useRef<HTMLDivElement>(null);
  const cardFloat2Ref = useRef<HTMLDivElement>(null);

  const [selectedTrackIndex, setSelectedTrackIndex] = useState(0);
  const [activeReaction, setActiveReaction] = useState<string | null>(null);

  const currentTrack = tracks[selectedTrackIndex];

  // Hook handles all GSAP timeline and floating animations
  useHeroAnimation({
    containerRef,
    badgeRef,
    headlineRef,
    subtextRef,
    ctaGroupRef,
    trustBarRef,
    mockupRef,
    cardFloat1Ref,
    cardFloat2Ref,
  });

  const handleReaction = (emoji: string) => {
    setActiveReaction(emoji);
    setTimeout(() => setActiveReaction(null), 1800);
  };

  return (
    <section
      ref={containerRef}
      className="relative pt-32 pb-20 lg:pt-36 lg:pb-28 overflow-hidden bg-gradient-to-b from-purple-50/50 via-white to-slate-50/70 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300"
    >
      {/* Pastel Ambient Orbs */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-tr from-purple-300/30 via-pink-200/20 to-sky-200/30 dark:from-purple-900/20 dark:via-pink-900/10 dark:to-sky-900/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-28 -left-20 w-80 h-80 bg-purple-200/40 dark:bg-purple-950/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-12 -right-20 w-96 h-96 bg-sky-200/40 dark:bg-sky-950/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-14">
          {/* Left Column: Hero Copy */}
          <div className="flex-1 text-center lg:text-left z-10">
            {/* Top Pill */}
            <div
              ref={badgeRef}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100/90 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800/50 shadow-sm backdrop-blur-md mb-6 hover:scale-105 transition-transform cursor-default"
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-xs sm:text-sm font-semibold text-purple-900 dark:text-purple-200">
                1-on-1 Mock Interviews Across All Major Career Tracks
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-purple-200/90 dark:bg-purple-800 text-purple-800 dark:text-purple-100">
                Live
              </span>
            </div>

            {/* Headline */}
            <h1
              ref={headlineRef}
              className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.08] mb-6"
            >
              Master Your <br />
              <span className="text-gradient">Dream Interview</span>
            </h1>

            {/* Subtext */}
            <p
              ref={subtextRef}
              className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              Whether you are preparing for <strong>Tech & SDE loops</strong>, <strong>UPSC Civil Services</strong>, <strong>Product Management</strong>, or <strong>Banking & Govt Exams</strong>—practice with verified mentors who have cleared and conducted these exact interviews.
            </p>

            {/* CTA Group */}
            <div
              ref={ctaGroupRef}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center"
            >
              <Link href="/student/auth" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-13 px-8 text-base font-semibold rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <Sparkles className="w-5 h-5 mr-2 text-purple-200 animate-pulse" />
                  Find Your Track Mentor
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>

              <Link href="/expert/auth" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto h-13 px-7 text-base font-semibold rounded-2xl border-2 border-purple-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/70 hover:bg-purple-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 backdrop-blur-md transition-all"
                >
                  Join as an Expert
                </Button>
              </Link>
            </div>

            {/* Trust Metrics */}
            <div
              ref={trustBarRef}
              className="mt-10 pt-8 border-t border-purple-100 dark:border-white/10 grid grid-cols-3 gap-4 text-center lg:text-left"
            >
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  5+
                </div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                  Specialized Tracks
                </p>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-purple-600 dark:text-purple-400">
                  98.4%
                </div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                  Offer Success Rate
                </p>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center justify-center lg:justify-start gap-1">
                  4.9 <Star className="w-4 h-4 fill-emerald-500 text-emerald-500 inline" />
                </div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                  Candidate Rating
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Multi-Track Interview Explorer & Live Scorecard HUD */}
          <div className="flex-1 relative w-full lg:w-auto mt-4 lg:mt-0">
            <div
              ref={mockupRef}
              className="relative z-10 rounded-[2.5rem] p-4 sm:p-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-purple-200/80 dark:border-white/10 shadow-2xl shadow-purple-900/10 dark:shadow-purple-950/40"
            >
              {/* Studio Window Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-purple-100 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-400/90" />
                  <div className="w-3 h-3 rounded-full bg-amber-400/90" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400/90" />
                  <span className="ml-2 text-xs font-bold text-slate-700 dark:text-slate-200">
                    Interview Track Simulator
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-100/80 dark:bg-purple-950/60 rounded-full px-3 py-1 border border-purple-200/60 dark:border-purple-800/40">
                  <Sparkles className="w-3.5 h-3.5 text-purple-500 animate-spin" />
                  <span>Choose Your Target Exam</span>
                </div>
              </div>

              {/* Track Selector Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none">
                {tracks.map((t, idx) => {
                  const Icon = t.icon;
                  const isSelected = selectedTrackIndex === idx;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTrackIndex(idx)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                        isSelected
                          ? "bg-slate-900 text-white dark:bg-purple-600 dark:text-white shadow-md scale-105"
                          : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {t.shortLabel}
                    </button>
                  );
                })}
              </div>

              {/* Main Interactive Track Stage */}
              <div className="relative rounded-2xl bg-slate-950 text-slate-100 p-4 sm:p-5 min-h-[300px] flex flex-col justify-between overflow-hidden border border-slate-800">
                {/* Reaction Overlay */}
                {activeReaction && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 animate-bounce">
                    <div className="text-6xl p-4 bg-white/20 dark:bg-black/40 backdrop-blur-xl rounded-full border border-white/30 shadow-2xl">
                      {activeReaction}
                    </div>
                  </div>
                )}

                {/* Reaction Bar */}
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-slate-900/80 backdrop-blur-md p-1 rounded-xl border border-white/10 z-20">
                  {["🔥", "🚀", "💡", "💯"].map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleReaction(emoji)}
                      className="p-1 text-sm hover:scale-125 transition-transform rounded-lg hover:bg-white/10"
                      title={`React with ${emoji}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                {/* Track Content */}
                <div className="space-y-4 animate-in fade-in duration-300">
                  {/* Track Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pr-28">
                    <div>
                      <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                        {currentTrack.name}
                      </h3>
                      <p className="text-[11px] text-purple-300 font-medium">
                        Target: {currentTrack.targetOrgs.join(" • ")}
                      </p>
                    </div>
                  </div>

                  {/* Rounds Covered Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {currentTrack.roundsCovered.map((round, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300"
                      >
                        ✓ {round}
                      </span>
                    ))}
                  </div>

                  {/* Evaluation Rubric Bars */}
                  <div className="space-y-2 pt-2 text-xs">
                    <div className="flex justify-between items-center pb-1 border-b border-slate-800/80">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Live Rubric Scorecard
                      </span>
                      <span className="text-[11px] font-extrabold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-800">
                        {currentTrack.recommendation}
                      </span>
                    </div>

                    {currentTrack.mockCriteria.map((crit, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between text-slate-300 mb-1 text-[11px]">
                          <span>{crit.label}</span>
                          <span className="font-bold text-purple-300">{crit.score}</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-sky-400 rounded-full transition-all duration-500"
                            style={{ width: `${crit.percent}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Voice Feedback HUD */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-purple-950 flex items-center justify-center border border-purple-800 text-purple-300">
                      <Volume2 className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-1 bg-purple-400 rounded-full animate-[pulse_0.6s_infinite] h-3" />
                      <div className="w-1 bg-purple-400 rounded-full animate-[pulse_0.4s_infinite] h-5" />
                      <div className="w-1 bg-purple-300 rounded-full animate-[pulse_0.8s_infinite] h-2.5" />
                      <div className="w-1 bg-purple-400 rounded-full animate-[pulse_0.5s_infinite] h-4" />
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-300 italic truncate max-w-[260px] sm:max-w-[300px]">
                    {currentTrack.feedbackQuote}
                  </p>

                  <div className="flex items-center gap-1 text-[10px] text-purple-300 bg-purple-950/70 px-2 py-0.5 rounded-md border border-purple-800/60 font-mono whitespace-nowrap">
                    <Mic className="w-3 h-3 text-emerald-400" />
                    <span>{currentTrack.mentorTitle}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Pastel Badge #1 */}
            <div
              ref={cardFloat1Ref}
              className="absolute -top-12 -right-4 sm:-right-8 bg-white/95 dark:bg-slate-900/95 p-4 rounded-3xl shadow-xl shadow-emerald-500/10 border border-emerald-200 dark:border-emerald-800/50 backdrop-blur-xl z-20"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-950 rounded-2xl flex items-center justify-center border border-emerald-200 dark:border-emerald-700 shadow-inner">
                  <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-300" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                      UPSC & Tech Mocks
                    </p>
                    <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    500+ Verified Domain Mentors
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Pastel Badge #2 */}
            <div
              ref={cardFloat2Ref}
              className="absolute -bottom-8 -left-4 sm:-left-8 bg-white/95 dark:bg-slate-900/95 p-4 rounded-3xl shadow-xl shadow-purple-500/10 border border-purple-200 dark:border-purple-800/50 backdrop-blur-xl z-20"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-950 rounded-2xl flex items-center justify-center border border-purple-200 dark:border-purple-800">
                  <CheckCircle2 className="w-5 h-5 text-purple-600 dark:text-purple-300" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    Detailed Scorecard Delivery
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Within 30 mins of session
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
