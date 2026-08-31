"use client";

import React, { useState, useEffect } from 'react';
import SessionCard, { SessionData, SessionStatus } from '@/app/components/SessionCard';
import { motion, AnimatePresence } from 'framer-motion';
import { authenticatedGet } from '@/providers/api';
import { useRouter } from 'next/navigation';
import { CalendarX2, Loader2 } from 'lucide-react';

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
  const router = useRouter();
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
            mentorAvatar: s.profile_picture_url,
            date: dateStr,
            time: timeStr,
            status: sessionStatus,
            joinLink: s.meet_link || '#',
          };
        });

        setSessions(mappedSessions);
      } catch (err) {
        console.warn("Failed to fetch sessions:", err);
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
    <div className="space-y-6">
      {/* Intro */}
      <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
        Manage your mock interviews and review past feedback.
      </p>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-2xl w-fit bg-purple-50/80 dark:bg-purple-950/30 border border-purple-200/60 dark:border-purple-800/30">
        {(["upcoming", "past"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 sm:px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
              activeTab === tab
                ? "bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
            }`}
          >
            {tab === "upcoming" ? "Upcoming Sessions" : "Past Sessions"}
          </button>
        ))}
      </div>

      {/* Sessions Grid */}
      <div className="min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Loader2 className="w-10 h-10 animate-spin text-purple-600 dark:text-purple-400" />
            <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium">
              Loading your sessions...
            </p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {displayedSessions.length > 0 ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
              >
                {displayedSessions.map((session, idx) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
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
                className="flex flex-col items-center justify-center p-12 sm:p-16 text-center rounded-3xl border border-dashed border-slate-300 dark:border-white/10 bg-slate-50/60 dark:bg-slate-800/30"
              >
                <div className="w-20 h-20 rounded-full bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center mb-5">
                  <CalendarX2 className="w-9 h-9 text-purple-400 dark:text-purple-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  No {activeTab} sessions found
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">
                  {activeTab === "upcoming"
                    ? "You don't have any mock interviews scheduled right now. Book one to start leveling up!"
                    : "You haven't completed any sessions yet."}
                </p>
                {activeTab === "upcoming" && (
                  <button
                    onClick={() => router.push("/student/home")}
                    className="btn-student-primary text-sm"
                  >
                    Book a Mentor
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
