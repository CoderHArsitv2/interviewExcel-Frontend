"use client";

import { useAuthContext } from "@/providers/authProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { StudentProfileResponse } from "./type";
import FeatureCard from "@/app/components/FeatureCard";
import EditProfileModal from "@/app/components/EditProfileModal";
import { authenticatedGet } from "@/providers/api";

const StudentProfilePage = () => {
  const user = useAuthContext();
  const [studentProfile, setStudentProfile] =
    useState<StudentProfileResponse>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = (updatedProfile: any) => {
    setStudentProfile(updatedProfile);
    // optionally call API to persist changes
  };

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        const res = await authenticatedGet("/student/profile");
        // setStudentProfile(res.data);
      } catch (error) {
        console.error("Error fetching student profile:", error);
      }
    };
    fetchStudentProfile();
  }, []);

  if (!user) {
    return (
      <div className="flex h-[80vh] items-center justify-center text-gray-500">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="w-[90vw] max-w-[1200px] mx-1 mb-10 my-12">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Card: Profile Overview */}
        <Card className="flex flex-col items-center gap-4 bg-gray-100 rounded-3xl animate-fadeInUp border-theme shadow-blue-400  shadow-lg p-6 w-full md:w-[30%]">
          <div className="relative w-50 h-50 rounded-full overflow-hidden shadow-xl border-4   border-theme shadow-xl shadow-blue-400">
            <Image
              src="/default_profile.jpg"
              alt="Student Avatar"
              fill
              className="object-cover"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            {studentProfile?.name || "Harshit Saxena"}
          </h2>
          <span className="text-gray-500 capitalize tracking-wide">
            {studentProfile?.role || "Student"}
          </span>

          {/* Stats */}
          <div className="flex gap-4 mt-6 w-full justify-center">
            <FeatureCard title="12" description="Sessions" />
            <FeatureCard title="50" description="Points" />
          </div>

          <button
            className="mt-6 px-6 py-2 bg-theme hover:bg-blue-900 text-white rounded-full shadow-md transition"
            onClick={() => setIsModalOpen(true)}
          >
            Edit Profile
          </button>
        </Card>
        <EditProfileModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          profile={{
            name: studentProfile?.name || "",
            phone: studentProfile?.phone || "",
            city: studentProfile?.city || "",
            date_of_birth: studentProfile?.dob || "",
            preparing_for: studentProfile?.course || "",
            about_me: studentProfile?.about || "",
            skills: studentProfile?.skills || [],
          }}
          onSave={handleSave}
          
        />

        {/* Right Card: Detailed Info */}
        <Card className="flex flex-col gap-6 animate-fadeInUp rounded-3xl border-theme bg-gray-100 shadow-lg shadow-blue-400 p-6 w-full md:w-[65%]">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-theme">
              Student Details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DetailItem
              label="Email"
              value={studentProfile?.email || "harshit@example.com"}
            />
            <DetailItem
              label="Phone"
              value={studentProfile?.phone || "+91 1234567890"}
            />
            <DetailItem
              label="Preparing For"
              value={studentProfile?.course || "Software Developer"}
            />
            <DetailItem
              label="Date Of Birth"
              value={studentProfile?.dob || "04 April 2027"}
            />
            <DetailItem
              label="My City"
              value={studentProfile?.city || "Delhi"}
            />

            {/* About Me */}
            <div className="col-span-1 md:col-span-2">
              <p className="text-gray-500 text-sm mb-1">About Me</p>
              <p className="text-gray-800 font-medium bg-blue-200 rounded-xl p-3">
                {studentProfile?.about ||
                  "Here to explore new opportunities and grow as a developer."}
              </p>
            </div>

            {/* Skills */}
            <div className="col-span-1 md:col-span-2">
              <p className="text-gray-500 text-sm mb-2">Skills</p>
              <div className="flex flex-wrap gap-2">
                {(
                  studentProfile?.skills || [
                    "JavaScript",
                    "React",
                    "Next.js",
                    "Node.js",
                  ]
                ).map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-theme text-white text-sm rounded-full shadow-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-gray-500 text-sm">{label}</p>
    <p className="text-gray-800 font-medium">{value}</p>
  </div>
);

export default StudentProfilePage;
