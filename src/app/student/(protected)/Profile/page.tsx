"use client";

import { useAuthContext } from "@/providers/authProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { StudentProfileResponse } from "./type";

const StudentProfilePage = () => {
  const user = useAuthContext();
  const [studentProfile, setStudentProfile] =
    useState<StudentProfileResponse>();

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        const res = await fetch("/api/student/profile");
        const data = await res.json();
        setStudentProfile(data);
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
    <div className="w-[90vw] max-w-[1200px] mx-auto my-12">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Card: Profile */}
        <Card className="flex flex-col items-center gap-4 rounded-3xl bg-white shadow-lg p-6 w-full md:w-[30%]">
          <div className="relative w-36 h-36 rounded-full overflow-hidden shadow-xl border-4 border-blue-200">
            <Image
              src="/interview_excel.png"
              alt="Student Avatar"
              fill
              className="object-cover"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            {studentProfile?.name || "Harshit Saxena"}
          </h2>
          <span className="text-gray-500 capitalize">
            {studentProfile?.role || "Student"}
          </span>
          <div className="flex gap-4 mt-4">
            <div className="flex flex-col items-center">
              <span className="font-bold text-lg">12</span>
              <span className="text-gray-400 text-sm">Sessions</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-bold text-lg">48</span>
              <span className="text-gray-400 text-sm">Points</span>
            </div>
          </div>
          <button className="mt-6 px-6 py-2 bg-theme hover:bg-blue-00 text-white rounded-full transition">
            Edit Profile
          </button>
        </Card>

        {/* Right Card: Details */}
        <Card className="flex flex-col gap-4 rounded-3xl bg-white shadow-lg p-6 w-full md:w-[65%]">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">
              Student Details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 text-sm">Email</p>
              <p className="text-gray-800 font-medium">
                {studentProfile?.email || "harshit@example.com"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Phone</p>
              <p className="text-gray-800 font-medium">
                {studentProfile?.phone || "+91 1234567890"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Course</p>
              <p className="text-gray-800 font-medium">
                {studentProfile?.course || "Computer Science"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Batch</p>
              <p className="text-gray-800 font-medium">
                {studentProfile?.batch || "2023-2027"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentProfilePage;
