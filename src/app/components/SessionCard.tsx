"use client";

import React from "react";
import Image from "next/image";
import { Calendar, Clock, Video, FileText, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export type SessionStatus = "upcoming" | "completed" | "cancelled" | "scheduled";

export interface SessionData {
    id: string;
    mentorName: string;
    mentorCompany: string;
    mentorAvatar: string;
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
    const isUpcoming = session.status === "upcoming" || session.status === "scheduled";
    const isCompleted = session.status === "completed";
    const isCancelled = session.status === "cancelled";

    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group overflow-hidden">
            {/* Subtle top border accent based on status */}
            <div className={`absolute top-0 left-0 w-full h-1 ${isUpcoming ? "bg-blue-500" : isCompleted ? "bg-green-500" : "bg-red-500"
                }`} />

            {/* Header: Mentor Info */}
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-gray-50 shadow-sm">
                        <Image
                            src={session.mentorAvatar}
                            alt={session.mentorName}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-gray-900 leading-tight">{session.mentorName}</h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 mt-1">
                            {session.mentorCompany}
                        </span>
                    </div>
                </div>

                {/* Status Badge */}
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${isUpcoming ? "bg-blue-100 text-blue-700" :
                    isCompleted ? "bg-green-100 text-green-700" :
                        "bg-red-100 text-red-700"
                    }`}>
                    {isUpcoming && <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>}
                    {isCompleted && <CheckCircle className="w-3.5 h-3.5" />}
                    {isCancelled && <XCircle className="w-3.5 h-3.5" />}

                    {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                </div>
            </div>

            <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-100 to-transparent mb-5" />

            {/* Body: Date & Time */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 mb-6 text-gray-600">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-gray-50 rounded-lg text-gray-500">
                        <Calendar className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-sm">{session.date}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-gray-50 rounded-lg text-gray-500">
                        <Clock className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-sm">{session.time}</span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
                {isUpcoming && (
                    <>
                        <Button
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/25 transition-all"
                            onClick={() => {
                                if (session.joinLink && session.joinLink !== '#') {
                                    window.open(session.joinLink, '_blank', 'noopener,noreferrer');
                                }
                            }}
                        >
                            <Video className="w-4 h-4 mr-2" />
                            Join Call
                        </Button>
                        <Button variant="outline" className="text-gray-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200 rounded-xl">
                            Cancel
                        </Button>
                    </>
                )}

                {isCompleted && (
                    <Button variant="outline" className="flex-1 border-gray-200 hover:bg-gray-50 rounded-xl text-gray-700">
                        <FileText className="w-4 h-4 mr-2" />
                        View Feedback
                    </Button>
                )}

                {isCancelled && (
                    <Button variant="ghost" disabled className="flex-1 text-gray-400 bg-gray-50 rounded-xl">
                        Session Cancelled
                    </Button>
                )}
            </div>
        </div>
    );
}
