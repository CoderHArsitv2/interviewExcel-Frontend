"use client";

import React from "react";
import { Calendar, Clock, Video, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusPill from "@/app/components/StatusPill";
import RemoteAvatar from "@/app/components/RemoteAvatar";

export type SessionStatus =
  | "upcoming"
  | "completed"
  | "cancelled"
  | "scheduled";

export interface SessionData {
  id: string;
  mentorName: string;
  mentorCompany: string;
  mentorAvatar?: string;
  date: string; // e.g., "Oct 24, 2024"
  time: string; // e.g., "10:00 AM - 11:00 AM"
  status: SessionStatus;
  joinLink?: string;
  feedbackLink?: string;
}

interface SessionCardProps {
  session: SessionData;
}

export default function SessionCard({ session }: SessionCardProps) {
  const isUpcoming =
    session.status === "upcoming" || session.status === "scheduled";
  const isCompleted = session.status === "completed";
  const isCancelled = session.status === "cancelled";

  const canJoin = !!session.joinLink && session.joinLink !== "#";

  return (
    <div className="profile-card p-5 sm:p-6 relative group overflow-hidden hover:-translate-y-1 hover:border-purple-300/70 dark:hover:border-purple-700/50 transition-all duration-300">
      {/* Status accent along the top edge */}
      <div
        className={`absolute top-0 left-0 w-full h-1 ${
          isUpcoming
            ? "bg-purple-500"
            : isCompleted
            ? "bg-emerald-500"
            : "bg-rose-500"
        }`}
      />

      {/* Header: Mentor Info */}
      <div className="flex items-start justify-between gap-3 mb-5">
        <div className="flex items-center gap-4 min-w-0">
          <RemoteAvatar
            src={session.mentorAvatar}
            name={session.mentorName}
            role="expert"
            className="w-14 h-14 shrink-0 border-2 border-white dark:border-slate-800 ring-2 ring-purple-200/60 dark:ring-purple-800/40 shadow-sm"
          />
          <div className="min-w-0">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight truncate">
              {session.mentorName}
            </h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/70 dark:border-purple-800/40 mt-1">
              {session.mentorCompany}
            </span>
          </div>
        </div>

        <StatusPill status={session.status} className="shrink-0" />
      </div>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent mb-5" />

      {/* Body: Date & Time */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-8 mb-6 text-slate-600 dark:text-slate-300">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
            <Calendar className="w-4 h-4" />
          </span>
          <span className="font-medium text-sm">{session.date}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
            <Clock className="w-4 h-4" />
          </span>
          <span className="font-medium text-sm">{session.time}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-1">
        {isUpcoming && (
          <>
            <Button
              disabled={!canJoin}
              title={canJoin ? undefined : "Meeting link not available yet"}
              className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-purple-500/25 transition-all disabled:opacity-50 disabled:shadow-none"
              onClick={() => {
                if (canJoin) {
                  window.open(
                    session.joinLink,
                    "_blank",
                    "noopener,noreferrer"
                  );
                }
              }}
            >
              <Video className="w-4 h-4 mr-2" />
              Join Call
            </Button>
            <Button
              variant="outline"
              className="rounded-xl border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 dark:hover:bg-rose-950/40 dark:hover:text-rose-300 dark:hover:border-rose-800/50"
            >
              Cancel
            </Button>
          </>
        )}

        {isCompleted && (
          <Button
            variant="outline"
            className="flex-1 rounded-xl border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <FileText className="w-4 h-4 mr-2" />
            View Feedback
          </Button>
        )}

        {isCancelled && (
          <Button
            variant="ghost"
            disabled
            className="flex-1 rounded-xl text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/60"
          >
            Session Cancelled
          </Button>
        )}
      </div>
    </div>
  );
}
