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
} from "lucide-react";

// Types
interface ExpertProfile {
    id: number;
    user_uuid: string;
    full_name: string;
    email: string;
    expertise: string;
    experience_years: number;
    profile_picture_url: string;
    fees_per_session: number;
    rating: number;
    total_sessions: number;
    verification_status: string;
    is_available: boolean;
    student_mentored: number;
    city: string;
    about_me: string;
}

interface AvailabilitySlot {
    id: number;
    expert_id: string;
    date: string;
    start_time: string;
    end_time: string;
    is_booked: boolean;
}

// Animation variants
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

const ExpertHomePage = () => {
    const { user } = useAuth();
    const router = useRouter();
    const [profile, setProfile] = useState<ExpertProfile | null>(null);
    const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.uuid) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                const [profileRes, slotsRes] = await Promise.all([
                    authenticatedGet<ExpertProfile>("/expert/profile"),
                    authenticatedGet<AvailabilitySlot[]>("/expert/all-slots"),
                ]);
                if (profileRes) setProfile(profileRes);
                if (slotsRes) setSlots(slotsRes);
            } catch (err) {
                console.error("Error fetching expert data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user?.uuid]);

    // Derive data
    const upcomingSlots = slots
        .filter((s) => s.is_booked && new Date(s.date) >= new Date())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 5);

    const totalAvailableSlots = slots.filter((s) => !s.is_booked).length;
    const totalBookedSlots = slots.filter((s) => s.is_booked).length;
    const estimatedEarnings = profile
        ? (profile.total_sessions * profile.fees_per_session) / 100
        : 0;

    // Stats config
    const stats = [
        {
            label: "Total Sessions",
            value: profile?.total_sessions ?? 0,
            icon: CalendarCheck,
            color: "from-amber-500 to-orange-500",
            bgLight: "bg-amber-50",
            textColor: "text-amber-600",
        },
        {
            label: "Students Mentored",
            value: profile?.student_mentored ?? 0,
            icon: Users,
            color: "from-orange-500 to-amber-500",
            bgLight: "bg-orange-50",
            textColor: "text-orange-600",
        },
        {
            label: "Rating",
            value: profile?.rating ? `${profile.rating} ★` : "New",
            icon: Star,
            color: "from-yellow-400 to-amber-500",
            bgLight: "bg-yellow-50",
            textColor: "text-yellow-600",
        },
        {
            label: "Earnings",
            value: `₹${estimatedEarnings.toLocaleString("en-IN")}`,
            icon: IndianRupee,
            color: "from-emerald-500 to-green-500",
            bgLight: "bg-emerald-50",
            textColor: "text-emerald-600",
        },
    ];

    // Loading skeleton
    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
                {/* Welcome skeleton */}
                <div className="glass rounded-3xl p-8">
                    <div className="flex items-center gap-6">
                        <Skeleton className="w-20 h-20 rounded-2xl" />
                        <div className="space-y-3 flex-1">
                            <Skeleton className="h-8 w-1/3" />
                            <Skeleton className="h-5 w-1/2" />
                        </div>
                    </div>
                </div>
                {/* Stats skeleton */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-32 rounded-2xl" />
                    ))}
                </div>
                {/* Cards skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Skeleton className="h-64 rounded-2xl" />
                    <Skeleton className="h-64 rounded-2xl" />
                </div>
            </div>
        );
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-7xl mx-auto px-4 py-6 space-y-8"
        >
            {/* ═══════════════════ Welcome Banner ═══════════════════ */}
            <motion.div
                variants={itemVariants}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-500 p-8 text-white shadow-2xl shadow-amber-200/40"
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
                            Welcome back, {user?.name?.split(" ")[0] || "Expert"}!
                        </h1>
                        <p className="mt-2 text-amber-100 text-lg max-w-xl">
                            {upcomingSlots.length > 0
                                ? `You have ${upcomingSlots.length} upcoming session${upcomingSlots.length > 1 ? "s" : ""}. Keep up the great work!`
                                : "Ready to inspire? Set up your availability and start mentoring."}
                        </p>

                        <div className="flex items-center gap-3 mt-4">
                            {profile?.verification_status === "verified" ? (
                                <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 px-3 py-1">
                                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                                    Verified Expert
                                </Badge>
                            ) : (
                                <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 px-3 py-1">
                                    <Clock className="w-3.5 h-3.5 mr-1.5" />
                                    Verification Pending
                                </Badge>
                            )}
                            {profile?.is_available && (
                                <Badge className="bg-emerald-500/80 backdrop-blur-sm text-white border-emerald-400/30 px-3 py-1">
                                    Available
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Mini Quick Actions */}
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
                {stats.map((stat, idx) => (
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
                {/* Upcoming Sessions — spans 2 columns */}
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

                    {upcomingSlots.length === 0 ? (
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
                            {upcomingSlots.map((slot) => (
                                <div
                                    key={slot.id}
                                    className="flex items-center gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 hover:shadow-md transition-all"
                                >
                                    <div className="bg-amber-100 p-3 rounded-full text-amber-600">
                                        <CalendarCheck className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-900">
                                            {new Date(slot.date).toLocaleDateString("en-IN", {
                                                weekday: "short",
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </p>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span>
                                                {slot.start_time} — {slot.end_time}
                                            </span>
                                        </div>
                                    </div>
                                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
                                        Booked
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Right Column — Quick Stats & Actions */}
                <div className="space-y-6">
                    {/* Availability Overview */}
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
                                    {totalAvailableSlots}
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-white/40 rounded-xl">
                                <span className="text-sm text-gray-600 font-medium">
                                    Booked Slots
                                </span>
                                <span className="text-lg font-bold text-amber-600">
                                    {totalBookedSlots}
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-white/40 rounded-xl">
                                <span className="text-sm text-gray-600 font-medium">
                                    Session Fee
                                </span>
                                <span className="text-lg font-bold text-gray-900">
                                    ₹{profile ? (profile.fees_per_session / 100).toLocaleString("en-IN") : "—"}
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Quick Actions Promo */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-500/10 rounded-full -ml-12 -mb-12 blur-xl" />

                        <h3 className="font-bold text-lg relative z-10 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-amber-400" />
                            Grow Your Impact
                        </h3>
                        <p className="text-slate-300 text-sm mt-2 relative z-10 mb-4">
                            Keep your profile updated and slots available to attract more
                            students.
                        </p>
                        <div className="flex gap-3 relative z-10">
                            <Button
                                size="sm"
                                onClick={() => router.push("/expert/sessions")}
                                className="flex-1 bg-amber-500 hover:bg-amber-600 text-amber-950 font-semibold border-none"
                            >
                                Add Slots
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => router.push("/expert/profile")}
                                className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                            >
                                Edit Profile
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default ExpertHomePage;
