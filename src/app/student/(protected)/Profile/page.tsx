"use client";

import { useAuthContext } from "@/providers/authProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { useEffect, useState } from "react";
import { StudentProfileResponse } from "./type";

const StudentProfilePage = () => {
  const user = useAuthContext();

  const [studentProfile, setStudentProfile] = useState<StudentProfileResponse>();

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
    <div className="max-w-2xl mx-auto p-6">
      <Card className="shadow-lg rounded-2xl">
        <CardHeader className="flex flex-col items-center">
          <Avatar className="w-20 h-20 mb-3">
            <AvatarImage src={studentProfile?.avatar || ""} alt={studentProfile?.name || "Student"} />
            <AvatarFallback>{studentProfile?.name?.[0] || "S"}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-xl font-semibold">
            {studentProfile?.name || "Student Name"}
          </CardTitle>
          <p className="text-gray-500">{studentProfile?.email}</p>
        </CardHeader>

        <CardContent className="grid gap-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Role:</span>
            <span className="font-medium">{studentProfile?.role || "student"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Joined:</span>
            <span className="font-medium">
              {studentProfile?.createdAt
                ? new Date(studentProfile?.createdAt).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentProfilePage;
