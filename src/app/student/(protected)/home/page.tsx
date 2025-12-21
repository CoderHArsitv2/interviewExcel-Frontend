"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { authenticatedGet } from "@/providers/api";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar, Star, MapPin, Briefcase, Clock, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Match BE response structure
type Expert = {
  id: number;
  full_name: string;
  expertise: string;
  fees_per_session: number;
  city: string;
  user: User;
  experience_years: number;
  dob: string;
  rating: number;
  total_sessions: number;
  verification_status: string;
  student_mentored: number;
  is_available: boolean;
  about_me?: string;
  profile_picture_url?: string;
};

type User = {
  id: number;
  user_uuid: string;
  created_at: string;
  updated_at: string;
  full_name: string;
  email: string;
  picture: string;
  role: string;
}

const StudentHomePage = () => {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const FetchExperts = async () => {
    try {
      setIsLoading(true);
      const res: Expert[] = await authenticatedGet("/student/experts");
      if (res) {
        setExperts(res);
      }
    } catch (err) {
      console.error("Error fetching experts:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    FetchExperts();
  }, []);

  // helper: format expertise string → array
  const parseExpertise = (expertise: string) =>
    expertise ? expertise.split(",").map((e) => e.trim()) : [];

  // hardcoded right panel data
  const upcomingSessions = [
    { id: 1, expert: "John Doe", date: "15 Sep, 7:00 PM" },
    { id: 2, expert: "Jane Smith", date: "18 Sep, 6:30 PM" },
  ];
  const recommendedExperts = [
    "Tech Interview Mentor",
    "UPSC Specialist",
    "Banking Expert",
  ];

  return (
    <div className="p-4 md:p-8 flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
      {/* Left: Experts */}
      <div className="flex-1 space-y-8">
        {/* Header & Search */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Find Your <span className="text-gradient">Expert Mentor</span>
            </h1>
            <p className="text-gray-500 mt-2">
              Connect with industry leaders and boost your career.
            </p>
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <Input
              type="text"
              placeholder="Search experts by name, skill, or company..."
              className="pl-10 py-6 text-lg bg-white/50 backdrop-blur-sm border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl shadow-sm transition-all"
            />
          </div>
        </div>

        {/* Experts List */}
        <div className="space-y-6">
          {isLoading ? (
            // Skeleton Loading State
            Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="glass p-6 rounded-2xl flex flex-col md:flex-row gap-6"
              >
                <Skeleton className="w-24 h-24 rounded-2xl" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            experts.map((expert, idx) => (
              <motion.div
                key={expert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="glass p-6 rounded-2xl hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 border border-white/40 group"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Profile Picture */}
                  <div className="relative shrink-0">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden shadow-lg ring-4 ring-white/50">
                      <Image
                        src={expert.profile_picture_url || "/default-avatar.png"}
                        alt={expert.full_name || "Expert"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-3 -right-3 bg-white p-1.5 rounded-full shadow-md">
                      <div className="bg-green-100 text-green-700 p-1 rounded-full">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Info Section */}
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                      <div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {expert.user.full_name || "Unnamed Expert"}
                        </h2>
                        <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                          <MapPin className="w-4 h-4" />
                          <span>{expert.city || "Remote"}</span>
                          <span>•</span>
                          <Briefcase className="w-4 h-4" />
                          <span>{expert.experience_years > 0 ? `${expert.experience_years} Yrs Exp` : "Fresher"}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full font-medium text-sm">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{expert.rating || "New"}</span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm md:text-base line-clamp-2">
                      {expert.about_me || "Passionate about mentoring and helping students achieve their career goals."}
                    </p>

                    {/* Expertise */}
                    <div className="flex flex-wrap gap-2">
                      {parseExpertise(expert.expertise).map((skill, i) => (
                        <Badge key={i} variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <div className="pt-4 flex items-center justify-between border-t border-gray-100 mt-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Session Fee</p>
                        <p className="text-lg font-bold text-green-600">
                          ₹{expert.fees_per_session || "Free"} <span className="text-sm text-gray-400 font-normal">/ 60 min</span>
                        </p>
                      </div>
                      <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-200 rounded-xl px-6">
                        Book Now
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="lg:w-80 space-y-6">
        {/* Upcoming Sessions */}
        <div className="glass p-6 rounded-2xl border border-white/40">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
              <Calendar className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-gray-900">Upcoming Sessions</h2>
          </div>

          {upcomingSessions.length > 0 ? (
            <ul className="space-y-4">
              {upcomingSessions.map((s) => (
                <li
                  key={s.id}
                  className="p-3 bg-white/50 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-semibold text-sm text-gray-900">{s.expert}</p>
                    <Badge variant="outline" className="text-[10px] h-5">Confirmed</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <Clock className="w-3 h-3" />
                    {s.date}
                  </div>
                  <Button size="sm" variant="outline" className="w-full h-8 text-xs border-blue-200 text-blue-700 hover:bg-blue-50">
                    Join Meeting
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8 text-gray-500 text-sm">
              <Calendar className="w-8 h-8 mx-auto mb-2 opacity-20" />
              No upcoming sessions
            </div>
          )}
        </div>

        {/* Recommended Experts */}
        <div className="glass p-6 rounded-2xl border border-white/40">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
              <Star className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-gray-900">Top Categories</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {recommendedExperts.map((name, i) => (
              <Badge
                key={i}
                variant="outline"
                className="cursor-pointer hover:bg-gray-50 py-1.5 px-3 text-sm font-normal text-gray-600"
              >
                {name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Promo Card */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/20 rounded-full -ml-12 -mb-12 blur-xl"></div>

          <h3 className="font-bold text-lg relative z-10">Become an Expert</h3>
          <p className="text-indigo-100 text-sm mt-2 relative z-10 mb-4">
            Share your knowledge and earn by mentoring students.
          </p>
          <Button variant="secondary" size="sm" className="w-full relative z-10 bg-white text-indigo-600 hover:bg-indigo-50 border-none">
            Apply Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StudentHomePage;
