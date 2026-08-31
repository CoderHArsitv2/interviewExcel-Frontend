"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { authenticatedGet } from "@/providers/api";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import StatusPill from "@/app/components/StatusPill";
import RemoteAvatar from "@/app/components/RemoteAvatar";
import { useRouter } from "next/navigation";
import { staggerContainer, cardFadeUpVariant } from "@/animations";
import {
  Users,
  Star,
  CalendarCheck,
  IndianRupee,
  ArrowRight,
  CalendarPlus,
  UserCog,
  Clock,
  CheckCircle2,
  Sparkles,
  Video,
  CalendarX2,
} from "lucide-react";

// ─── Types matching GET /expert/dashboard response ───────────────────────────

interface ExpertInfo {
  full_name: string;
  verification_status: "pending" | "verified";
  is_available: boolean;
  profile_picture_url: string;
}

interface DashboardStats {
  total_sessions: number;
  students_mentored: number;
  rating: number;
  earnings: number;
}

interface UpcomingSession {
  id: number;
  session_uuid: string;
  student_uuid: string;
  student_name: string;
  start_time: string;
  end_time: string;
  meet_link: string;
  status: string;
}

interface SlotOverview {
  available_slots: number;
  booked_slots: number;
  session_fee: number;
}

interface DashboardResponse {
  expert: ExpertInfo;
  stats: DashboardStats;
  upcoming_sessions: UpcomingSession[];
  slot_overview: SlotOverview;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatSessionDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function formatSessionTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

/** Fees come back in paise. */
const rupees = (paise: number) =>
  `₹${Math.round((paise || 0) / 100).toLocaleString("en-IN")}`;

// ═════════════════════════════════════════════════════════════════════════════

const ExpertDashboardPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uuid) return;

    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await authenticatedGet<DashboardResponse>(
          "/expert/dashboard"
        );
        if (res) setData(res);
      } catch (err) {
        console.warn("Error fetching expert dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [user?.uuid]);

  // ─── Loading skeleton ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-6 lg:space-y-8">
        <Skeleton className="h-48 rounded-3xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-2 h-72 rounded-3xl" />
          <Skeleton className="h-72 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="profile-card p-10 flex flex-col items-center text-center gap-3">
        <CalendarX2 className="w-10 h-10 text-slate-300 dark:text-slate-600" />
        <p className="font-semibold text-slate-700 dark:text-slate-200">
          We couldn&apos;t load your dashboard
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Check your connection and try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="btn-expert-primary mt-2 text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  const { expert, stats, upcoming_sessions, slot_overview } = data;

  const totalSlots = slot_overview.available_slots + slot_overview.booked_slots;
  const bookedPercent = totalSlots
    ? Math.round((slot_overview.booked_slots / totalSlots) * 100)
    : 0;

  const statCards = [
    {
      label: "Total Sessions",
      value: String(stats.total_sessions ?? 0),
      icon: CalendarCheck,
      chip: "bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-300",
    },
    {
      label: "Students Mentored",
      value: String(stats.students_mentored ?? 0),
      icon: Users,
      chip: "bg-purple-100 text-purple-600 dark:bg-purple-950/60 dark:text-purple-300",
    },
    {
      label: "Rating",
      value: stats.rating ? `${stats.rating} ★` : "New",
      icon: Star,
      chip: "bg-yellow-100 text-yellow-600 dark:bg-yellow-950/60 dark:text-yellow-300",
    },
    {
      label: "Earnings",
      value: rupees(stats.earnings),
      icon: IndianRupee,
      chip: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300",
    },
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6 lg:space-y-8"
    >
      {/* ═══════════════════ Hero Banner ═══════════════════ */}
      <motion.section
        variants={cardFadeUpVariant}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 dark:from-amber-600 dark:via-amber-700 dark:to-orange-700 p-6 sm:p-8 text-slate-950 dark:text-white shadow-xl shadow-amber-500/25 dark:shadow-amber-950/40"
      >
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-200/25 dark:bg-yellow-400/10 rounded-full -ml-24 -mb-24 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-6">
          {/* Avatar */}
          <div className="shrink-0">
            <RemoteAvatar
              src={expert.profile_picture_url}
              name={expert.full_name}
              role="expert"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-white/60 dark:border-white/20 shadow-lg text-xl"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest opacity-80">
                Expert Dashboard
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              Welcome back, {expert.full_name}!
            </h2>
            <p className="mt-1.5 text-sm sm:text-base opacity-80 max-w-xl">
              Ready to inspire? Set up your availability and start mentoring.
            </p>

            <div className="flex items-center gap-2 mt-4 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/85 dark:bg-white/15 backdrop-blur-sm text-slate-800 dark:text-white border border-white/40">
                {expert.verification_status === "verified" ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-300" />
                    Verified
                  </>
                ) : (
                  <>
                    <Clock className="w-3.5 h-3.5 text-amber-700 dark:text-amber-200" />
                    Verification Pending
                  </>
                )}
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/85 dark:bg-white/15 backdrop-blur-sm text-slate-800 dark:text-white border border-white/40">
                <span
                  className={`w-2 h-2 rounded-full ${
                    expert.is_available
                      ? "bg-emerald-500 animate-pulse"
                      : "bg-slate-400"
                  }`}
                />
                {expert.is_available ? "Available" : "Unavailable"}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 shrink-0">
            <Button
              onClick={() => router.push("/expert/sessions")}
              className="rounded-2xl bg-white/25 hover:bg-white/40 dark:bg-white/15 dark:hover:bg-white/25 backdrop-blur-sm text-slate-950 dark:text-white border border-white/40 font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <CalendarPlus className="w-4 h-4 mr-2" />
              Manage Slots
            </Button>
            <Button
              onClick={() => router.push("/expert/profile")}
              className="rounded-2xl bg-white hover:bg-amber-50 text-amber-700 font-semibold shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <UserCog className="w-4 h-4 mr-2" />
              Profile
            </Button>
          </div>
        </div>
      </motion.section>

      {/* ═══════════════════ Stats Cards ═══════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <motion.div
            key={stat.label}
            variants={cardFadeUpVariant}
            className="profile-card p-5 group hover:-translate-y-0.5 hover:border-amber-300/70 dark:hover:border-amber-700/50 transition-all duration-300"
          >
            <div
              className={`inline-flex p-2.5 rounded-xl mb-3 group-hover:scale-110 transition-transform duration-300 ${stat.chip}`}
            >
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {stat.value}
            </p>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* ═══════════════════ Main Content Grid ═══════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Upcoming Sessions ── */}
        <motion.section
          variants={cardFadeUpVariant}
          className="lg:col-span-2 profile-card p-5 sm:p-6"
        >
          <div className="flex items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100 dark:border-white/10">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300">
                <CalendarCheck className="w-5 h-5" />
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Upcoming Sessions
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-xl text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40 font-semibold"
              onClick={() => router.push("/expert/sessions")}
            >
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          {upcoming_sessions.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-300 dark:border-white/10 bg-slate-50/60 dark:bg-slate-800/30">
              <CalendarCheck className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
              <p className="font-semibold text-slate-700 dark:text-slate-200">
                No upcoming sessions yet
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Generate slots so students can book you!
              </p>
              <button
                className="btn-expert-primary mt-4 text-sm inline-flex items-center gap-2"
                onClick={() => router.push("/expert/sessions")}
              >
                <CalendarPlus className="w-4 h-4" />
                Generate Slots
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming_sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex flex-wrap items-center gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-white/5 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all"
                >
                  <span className="shrink-0 p-3 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300">
                    <CalendarCheck className="w-5 h-5" />
                  </span>

                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 dark:text-white truncate">
                      {session.student_name}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">
                        {formatSessionDate(session.start_time)} ·{" "}
                        {formatSessionTime(session.start_time)} –{" "}
                        {formatSessionTime(session.end_time)}
                      </span>
                    </div>
                  </div>

                  <StatusPill status={session.status} className="shrink-0" />

                  {session.meet_link && (
                    <Button
                      size="sm"
                      className="shrink-0 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-sm"
                      onClick={() => window.open(session.meet_link, "_blank")}
                    >
                      <Video className="w-4 h-4 mr-1.5" />
                      Join
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.section>

        {/* ── Slot Overview ── */}
        <motion.section
          variants={cardFadeUpVariant}
          className="profile-card p-5 sm:p-6"
        >
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100 dark:border-white/10">
            <span className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300">
              <Clock className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Slot Overview
            </h3>
          </div>

          {/* Booked vs available utilisation */}
          <div className="mb-5">
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Utilisation
              </span>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                {bookedPercent}%
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500"
                style={{ width: `${bookedPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
              {slot_overview.booked_slots} of {totalSlots || 0} slots booked
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-white/5 transition-all hover:bg-white dark:hover:bg-slate-800">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Available Slots
              </span>
              <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                {slot_overview.available_slots}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-white/5 transition-all hover:bg-white dark:hover:bg-slate-800">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Booked Slots
              </span>
              <span className="text-lg font-extrabold text-sky-600 dark:text-sky-400">
                {slot_overview.booked_slots}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-white/5 transition-all hover:bg-white dark:hover:bg-slate-800">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Session Fee
              </span>
              <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                {rupees(slot_overview.session_fee)}
              </span>
            </div>
          </div>

          <button
            onClick={() => router.push("/expert/sessions")}
            className="btn-expert-secondary w-full mt-5 text-sm flex items-center justify-center gap-2"
          >
            <CalendarPlus className="w-4 h-4" />
            Manage Availability
          </button>
        </motion.section>
      </div>
    </motion.div>
  );
};

export default ExpertDashboardPage;
