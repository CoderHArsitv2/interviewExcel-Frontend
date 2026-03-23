"use client";

import React, { useState, useEffect } from 'react';
import SessionCard, { SessionData, SessionStatus } from '@/app/components/SessionCard';
import { motion, AnimatePresence } from 'framer-motion';
import { authenticatedGet } from '@/providers/api';
import { Loader2 } from 'lucide-react';

interface SessionApiItem {
  id?: number;
  session_uuid?: string;
  expert_name?: string;
  profile_picture_url?: string;
  start_time?: string;
  end_time?: string;
  status?: string;
  meet_link?: string;
}

type SessionsApiResponse = SessionApiItem[] | { data?: SessionApiItem[] };

function normalizeSessionsResponse(response: SessionsApiResponse): SessionApiItem[] {
  if (Array.isArray(response)) {
    return response;
  }

  return Array.isArray(response.data) ? response.data : [];
}

export default function SessionsPage() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setIsLoading(true);
        const res = await authenticatedGet<SessionsApiResponse>('/student/sessions');

        const sessionsData = normalizeSessionsResponse(res);

        const mappedSessions: SessionData[] = sessionsData.map((s): SessionData => {
          // Format Date and Time
          let dateStr = "Date TBD";
          let timeStr = "Time TBD";

          if (s.start_time) {
            const startDate = new Date(s.start_time);
            dateStr = startDate.toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            });

            const startTimeStr = startDate.toLocaleTimeString(undefined, {
              hour: '2-digit',
              minute: '2-digit'
            });

            if (s.end_time) {
              const endDate = new Date(s.end_time);
              const endTimeStr = endDate.toLocaleTimeString(undefined, {
                hour: '2-digit',
                minute: '2-digit'
              });
              timeStr = `${startTimeStr} - ${endTimeStr}`;
            } else {
              timeStr = startTimeStr;
            }
          }

          let sessionStatus = (s.status?.toLowerCase() as SessionStatus) || 'upcoming';

          // If the session end_time is in the past, mark it as completed so it moves to the past tab
          if (s.end_time && new Date(s.end_time) < new Date()) {
            if (sessionStatus === 'scheduled' || sessionStatus === 'upcoming') {
              sessionStatus = 'completed';
            }
          }

          return {
            id: s.session_uuid || s.id?.toString() || Math.random().toString(),
            mentorName: s.expert_name || 'Industry Expert',
            mentorCompany: 'Expert', // No company provided in the current payload
            mentorAvatar: s.profile_picture_url || '/mascot.png',
            date: dateStr,
            time: timeStr,
            status: sessionStatus,
            joinLink: s.meet_link || '#',
          };
        });

        setSessions(mappedSessions);
      } catch (err) {
        console.error("Failed to fetch sessions:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const displayedSessions = sessions.filter(session => {
    if (activeTab === "upcoming") return session.status === "upcoming" || session.status === "scheduled";
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
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 text-blue-600">
              <Loader2 className="w-10 h-10 animate-spin" />
              <p className="mt-4 text-gray-500 font-medium">Loading your sessions...</p>
            </div>
          ) : (
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
          )}
        </div>

      </div>
    </div>
  );
}
