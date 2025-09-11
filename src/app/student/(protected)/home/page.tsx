"use client";
import React from "react";
import { motion } from "framer-motion";

type Expert = {
  id: string;
  full_name: string;
  expertise: string[];
  fees_per_session: number;
  city: string;
  experience: string;
  profile_picture_url: string;
  about_me: string;
};

const experts: Expert[] = [
  {
    id: "1",
    full_name: "Dr. Anjali Sharma",
    expertise: ["UPSC", "Essay Writing"],
    fees_per_session: 500,
    city: "Delhi",
    experience: "10+ years guiding UPSC aspirants",
    profile_picture_url: "https://randomuser.me/api/portraits/women/65.jpg",
    about_me: "Passionate about mentoring students for civil services.",
  },
  {
    id: "2",
    full_name: "Ravi Kumar",
    expertise: ["DSA", "System Design", "Coding Interviews"],
    fees_per_session: 800,
    city: "Bengaluru",
    experience: "Ex-Amazon SDE, 6+ years",
    profile_picture_url: "https://randomuser.me/api/portraits/men/32.jpg",
    about_me: "Helping students crack FAANG-level interviews.",
  },
  {
    id: "3",
    full_name: "Neha Verma",
    expertise: ["Banking Exams", "Quantitative Aptitude"],
    fees_per_session: 300,
    city: "Lucknow",
    experience: "5+ years in IBPS/SBI coaching",
    profile_picture_url: "https://randomuser.me/api/portraits/women/44.jpg",
    about_me: "Dedicated to helping aspirants clear govt exams.",
  },
];

const StudentHomePage = () => {
  return (
    <div className="p-4 md:p-8 space-y-8">
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
              src={expert.profile_picture_url}
              alt={expert.full_name}
              className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-2 border-blue-500"
            />

            {/* Info Section */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-lg md:text-xl font-bold">{expert.full_name}</h2>
              <p className="text-sm text-gray-600">{expert.city}</p>
              <p className="mt-2 text-gray-700 text-sm md:text-base">{expert.about_me}</p>

              <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-2">
                {expert.expertise.map((skill, i) => (
                  <span
                    key={i}
                    className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs md:text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <p className="mt-2 text-sm text-gray-700">
                <strong>Experience:</strong> {expert.experience}
              </p>

              <p className="mt-1 font-medium text-green-600 text-sm md:text-base">
                ₹{expert.fees_per_session} / session
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
  );
};

export default StudentHomePage;
