"use client";

import React, { useState } from 'react';
import SessionCard, { SessionData } from '@/app/components/SessionCard';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Data
const mockSessions: SessionData[] = [
  {
    id: "1",
    mentorName: "Sarah Chen",
    mentorCompany: "Google SWE",
    mentorAvatar: "/profile.jpg",
    date: "Tomorrow",
    time: "10:00 AM - 11:00 AM",
    status: "upcoming",
    joinLink: "#"
  },
  {
    id: "2",
    mentorName: "Alex Mercer",
    mentorCompany: "Amazon SDE II",
    mentorAvatar: "/mascot.png",
    date: "Oct 28, 2024",
    time: "2:00 PM - 3:00 PM",
    status: "upcoming",
    joinLink: "#"
  },
  {
    id: "3",
    mentorName: "Priya Sharma",
    mentorCompany: "Microsoft PM",
    mentorAvatar: "/profile.jpg",
    date: "Oct 15, 2024",
    time: "11:00 AM - 12:00 PM",
    status: "completed",
    feedbackLink: "#"
  },
  {
    id: "4",
    mentorName: "David Kim",
    mentorCompany: "Meta iOS Engineer",
    mentorAvatar: "/mascot.png",
    date: "Oct 05, 2024",
    time: "4:00 PM - 5:00 PM",
    status: "cancelled"
  }
];

export default function SessionsPage() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  const displayedSessions = mockSessions.filter(session => {
    if (activeTab === "upcoming") return session.status === "upcoming";
    return session.status === "completed" || session.status === "cancelled";
  });

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 lg:p-10">
      <div className="max-w-5xl mx-auto">

        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">My Sessions</h1>
          <p className="text-gray-500 text-lg">Manage your mock interviews and review past feedback.</p>
        </div>

        {/* Custom Tabs */}
        <div className="flex items-center gap-2 mb-8 bg-white p-1.5 rounded-2xl w-fit shadow-sm border border-gray-100">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${activeTab === "upcoming"
                ? "bg-blue-50 text-blue-700 shadow-sm"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              }`}
          >
            Upcoming Sessions
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${activeTab === "past"
                ? "bg-blue-50 text-blue-700 shadow-sm"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              }`}
          >
            Past Sessions
          </button>
        </div>

        {/* Sessions Grid */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="popLayout">
            {displayedSessions.length > 0 ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid gap-6 md:grid-cols-2"
              >
                {displayedSessions.map((session, idx) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <SessionCard session={session} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center justify-center p-16 text-center bg-white rounded-3xl border border-dashed border-gray-200"
              >
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <span className="text-3xl">📅</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No {activeTab} sessions found</h3>
                <p className="text-gray-500 max-w-sm mb-6">
                  {activeTab === "upcoming"
                    ? "You don't have any mock interviews scheduled right now. Book one to start leveling up!"
                    : "You haven't completed any sessions yet."}
                </p>
                {activeTab === "upcoming" && (
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg shadow-blue-500/25 transition-all">
                    Book a Mentor
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}