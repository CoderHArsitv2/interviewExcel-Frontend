"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { authenticatedGet } from "@/providers/api";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import {
    Users,
    Star,
    CalendarCheck,
    IndianRupee,
    ArrowRight,
    CalendarPlus,
    UserCog,
    Clock,
    TrendingUp,
    CheckCircle2,
    Sparkles,
    Video,
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

// ─── Animation variants ─────────────────────────────────────────────────────

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// ─── Helper: format a date string nicely ────────────────────────────────────

function formatSessionDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function formatSessionTime(iso: string) {
    return new Date(iso).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
}

// ─── Status badge color mapping ─────────────────────────────────────────────

function statusBadge(status: string) {
    const map: Record<string, { bg: string; text: string; label: string }> = {
        scheduled: { bg: "bg-blue-100", text: "text-blue-700", label: "Scheduled" },
        completed: { bg: "bg-green-100", text: "text-green-700", label: "Completed" },
        cancelled: { bg: "bg-red-100", text: "text-red-700", label: "Cancelled" },
    };
    const s = map[status] ?? { bg: "bg-gray-100", text: "text-gray-700", label: status };
    return s;
}

// ═════════════════════════════════════════════════════════════════════════════
// Component
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
                const res = await authenticatedGet<DashboardResponse>("/expert/dashboard");
                if (res) setData(res);
            } catch (err) {
                console.error("Error fetching expert dashboard:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, [user?.uuid]);

    // ─── Loading skeleton ────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
                <div className="glass rounded-3xl p-8">
                    <div className="flex items-center gap-6">
                        <Skeleton className="w-20 h-20 rounded-2xl" />
                        <div className="space-y-3 flex-1">
                            <Skeleton className="h-8 w-1/3" />
                            <Skeleton className="h-5 w-1/2" />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-32 rounded-2xl" />
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Skeleton className="lg:col-span-2 h-64 rounded-2xl" />
                    <Skeleton className="h-64 rounded-2xl" />
                </div>
            </div>
        );
    }

    if (!data) return null;

    const { expert, stats, upcoming_sessions, slot_overview } = data;

    // ─── Stats card config ───────────────────────────────────────────────────
    const statCards = [
        {
            label: "Total Sessions",
            value: stats.total_sessions,
            icon: CalendarCheck,
            bgLight: "bg-amber-50",
            textColor: "text-amber-600",
        },
        {
            label: "Students Mentored",
            value: stats.students_mentored,
            icon: Users,
            bgLight: "bg-orange-50",
            textColor: "text-orange-600",
        },
        {
            label: "Rating",
            value: stats.rating ? `${stats.rating} ★` : "New",
            icon: Star,
            bgLight: "bg-yellow-50",
            textColor: "text-yellow-600",
        },
        {
            label: "Earnings",
            value: `₹${(stats.earnings / 100).toLocaleString("en-IN")}`,
            icon: IndianRupee,
            bgLight: "bg-emerald-50",
            textColor: "text-emerald-600",
        },
    ];

    // ─── Render ──────────────────────────────────────────────────────────────
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-7xl mx-auto px-4 py-6 space-y-8"
        >
            {/* ═══════════════════ Hero Banner ═══════════════════ */}
            <motion.div
                variants={itemVariants}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 p-8 text-white shadow-2xl shadow-amber-200/40"
            >
                {/* Decorative blobs */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-300/20 rounded-full -ml-24 -mb-24 blur-2xl" />

                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <Sparkles className="w-6 h-6 text-yellow-200" />
                            <span className="text-amber-100 text-sm font-medium uppercase tracking-wider">
                                Expert Dashboard
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                            Welcome back, {expert.full_name}!
                        </h1>
                        <p className="mt-2 text-amber-100 text-lg max-w-xl">
                            Ready to inspire? Set up your availability and start mentoring.
                        </p>

                        <div className="flex items-center gap-3 mt-4 flex-wrap">
                            {expert.verification_status === "verified" ? (
                                <Badge className="bg-emerald-500/80 backdrop-blur-sm text-white border-emerald-400/30 px-3 py-1">
                                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                                    Verified
                                </Badge>
                            ) : (
                                <Badge className="bg-yellow-400/80 backdrop-blur-sm text-yellow-950 border-yellow-300/30 px-3 py-1">
                                    <Clock className="w-3.5 h-3.5 mr-1.5" />
                                    Verification Pending
                                </Badge>
                            )}
                            {expert.is_available ? (
                                <Badge className="bg-emerald-500/80 backdrop-blur-sm text-white border-emerald-400/30 px-3 py-1">
                                    Available
                                </Badge>
                            ) : (
                                <Badge className="bg-white/20 backdrop-blur-sm text-white/70 border-white/20 px-3 py-1">
                                    Unavailable
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3">
                        <Button
                            onClick={() => router.push("/expert/sessions")}
                            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border border-white/20 shadow-lg"
                        >
                            <CalendarPlus className="w-4 h-4 mr-2" />
                            Manage Slots
                        </Button>
                        <Button
                            onClick={() => router.push("/expert/profile")}
                            variant="secondary"
                            className="bg-white text-amber-700 hover:bg-amber-50 shadow-lg"
                        >
                            <UserCog className="w-4 h-4 mr-2" />
                            Profile
                        </Button>
                    </div>
                </div>
            </motion.div>

            {/* ═══════════════════ Stats Cards ═══════════════════ */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat) => (
                    <motion.div
                        key={stat.label}
                        variants={itemVariants}
                        className="glass rounded-2xl p-5 border border-white/40 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group cursor-default"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div
                                className={`p-2.5 rounded-xl ${stat.bgLight} group-hover:scale-110 transition-transform duration-300`}
                            >
                                <stat.icon className={`w-5 h-5 ${stat.textColor}`} />
                            </div>
                            <TrendingUp className="w-4 h-4 text-gray-300 group-hover:text-gray-400 transition-colors" />
                        </div>
                        <p className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                            {stat.value}
                        </p>
                        <p className="text-sm text-gray-500 mt-1 font-medium">
                            {stat.label}
                        </p>
                    </motion.div>
                ))}
            </div>

            {/* ═══════════════════ Main Content Grid ═══════════════════ */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ── Upcoming Sessions (left, wider) ── */}
                <motion.div
                    variants={itemVariants}
                    className="lg:col-span-2 glass rounded-3xl border border-white/40 p-6 shadow-xl"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                                <CalendarCheck className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">
                                Upcoming Sessions
                            </h2>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary hover:text-primary/80"
                            onClick={() => router.push("/expert/sessions")}
                        >
                            View All <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                    </div>

                    {upcoming_sessions.length === 0 ? (
                        <div className="text-center py-12 bg-white/30 rounded-2xl border border-dashed border-gray-300">
                            <CalendarCheck className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                            <p className="text-gray-500 font-medium">
                                No upcoming sessions yet
                            </p>
                            <p className="text-sm text-gray-400 mt-1">
                                Generate slots so students can book you!
                            </p>
                            <Button
                                size="sm"
                                className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground"
                                onClick={() => router.push("/expert/sessions")}
                            >
                                <CalendarPlus className="w-4 h-4 mr-2" />
                                Generate Slots
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {upcoming_sessions.map((session) => {
                                const sb = statusBadge(session.status);
                                return (
                                    <div
                                        key={session.id}
                                        className="flex items-center gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 hover:shadow-md transition-all"
                                    >
                                        <div className="bg-amber-100 p-3 rounded-full text-amber-600 shrink-0">
                                            <CalendarCheck className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-900 truncate">
                                                {session.student_name}
                                            </p>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span>
                                                    {formatSessionDate(session.start_time)} ·{" "}
                                                    {formatSessionTime(session.start_time)} –{" "}
                                                    {formatSessionTime(session.end_time)}
                                                </span>
                                            </div>
                                        </div>
                                        <Badge className={`${sb.bg} ${sb.text} hover:${sb.bg} border-transparent shrink-0`}>
                                            {sb.label}
                                        </Badge>
                                        {session.meet_link && (
                                            <Button
                                                size="sm"
                                                className="bg-primary hover:bg-primary/90 text-primary-foreground shrink-0"
                                                onClick={() => window.open(session.meet_link, "_blank")}
                                            >
                                                <Video className="w-4 h-4 mr-1.5" />
                                                Join
                                            </Button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </motion.div>

                {/* ── Slot Overview (right, narrower) ── */}
                <motion.div
                    variants={itemVariants}
                    className="glass rounded-3xl border border-white/40 p-6 shadow-xl"
                >
                    <div className="flex items-center gap-3 mb-5">
                        <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                            <Clock className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">
                            Slot Overview
                        </h2>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-white/40 rounded-xl">
                            <span className="text-sm text-gray-600 font-medium">
                                Available Slots
                            </span>
                            <span className="text-lg font-bold text-emerald-600">
                                {slot_overview.available_slots}
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/40 rounded-xl">
                            <span className="text-sm text-gray-600 font-medium">
                                Booked Slots
                            </span>
                            <span className="text-lg font-bold text-blue-600">
                                {slot_overview.booked_slots}
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/40 rounded-xl">
                            <span className="text-sm text-gray-600 font-medium">
                                Session Fee
                            </span>
                            <span className="text-lg font-bold text-gray-900">
                                ₹{slot_overview.session_fee}
                            </span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default ExpertDashboardPage;
