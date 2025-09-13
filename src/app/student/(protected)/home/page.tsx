"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { authenticatedGet } from "@/providers/api";

// Match BE response structure
type Expert = {
  id: number;
  full_name: string;
  expertise: string; // comes as "a,b,c"
  fees_per_session: number;
  city: string;
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
    <div className="p-4 md:p-8 flex flex-col lg:flex-row gap-6">
      {/* Left: Experts */}
      <div className="flex-1 space-y-8">
        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="🔍 Search experts by name or expertise..."
            className="flex-1 border px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition">
            Search
          </button>
        </div>

        {/* Experts in Responsive Cards */}
        <div className="space-y-6">
          {experts.map((expert, idx) => (
            <motion.div
              key={expert.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              className="flex flex-col md:flex-row items-center md:items-start gap-6 border rounded-xl p-6 shadow-md hover:shadow-lg transition bg-white"
            >
              {/* Profile Picture */}
              <img
                src={expert.profile_picture_url || "/default-avatar.png"}
                alt={expert.full_name || "Expert"}
                className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-2 border-blue-500"
              />

              {/* Info Section */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-lg md:text-xl font-bold">
                  {expert.full_name || "Unnamed Expert"}
                </h2>
                <p className="text-sm text-gray-600">{expert.city || "—"}</p>
                <p className="mt-2 text-gray-700 text-sm md:text-base">
                  {expert.about_me || "No bio available."}
                </p>

                {/* Expertise */}
                <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-2">
                  {parseExpertise(expert.expertise).map((skill, i) => (
                    <span
                      key={i}
                      className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs md:text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Experience */}
                <p className="mt-2 text-sm text-gray-700">
                  <strong>Experience:</strong>{" "}
                  {expert.experience_years > 0
                    ? `${expert.experience_years} years`
                    : "Fresher"}
                </p>

                {/* Fees */}
                <p className="mt-1 font-medium text-green-600 text-sm md:text-base">
                  ₹{expert.fees_per_session || "Free"} / session
                </p>

                {/* Rating */}
                <p className="mt-1 text-yellow-500 text-sm">
                  ⭐ {expert.rating || "No ratings yet"}
                </p>
              </div>

              {/* CTA Button */}
              <button className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2 rounded-lg shadow hover:scale-105 transition">
                Book Session
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="lg:w-1/3 space-y-6">
        {/* Upcoming Sessions */}
        <div className="border rounded-lg p-4 shadow-sm bg-white">
          <h2 className="text-lg font-semibold mb-3">📅 Upcoming Sessions</h2>
          {upcomingSessions.length > 0 ? (
            <ul className="space-y-3">
              {upcomingSessions.map((s) => (
                <li
                  key={s.id}
                  className="p-3 border rounded-md flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{s.expert}</p>
                    <p className="text-sm text-gray-600">{s.date}</p>
                  </div>
                  <button className="text-sm bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700">
                    Join
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No upcoming sessions</p>
          )}
        </div>

        {/* Recommended Experts */}
        <div className="border rounded-lg p-4 shadow-sm bg-white">
          <h2 className="text-lg font-semibold mb-3">✨ Recommended Experts</h2>
          <ul className="space-y-3">
            {recommendedExperts.map((name, i) => (
              <li
                key={i}
                className="flex justify-between items-center p-2 border rounded-md"
              >
                <p>{name}</p>
                <button className="text-sm text-blue-600 hover:underline">
                  View
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StudentHomePage;
