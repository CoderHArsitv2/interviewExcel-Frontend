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
    useState<StudentProfileResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleSave = (updatedProfile: any) => {
    setStudentProfile(updatedProfile);
    // optionally call API to persist changes
  };

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        setIsLoading(true);
        const res: StudentProfileResponse = await authenticatedGet(
          "/student/profile"
        );
        setStudentProfile(res);
      } catch (error) {
        console.error("Error fetching student profile:", error);
      } finally {
        setIsLoading(false);
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
      {isLoading ? (
        <div className="flex h-[80vh] items-center justify-center text-gray-500">
          Loading profile...
        </div>
      ) : studentProfile !== null ? (
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Card: Profile Overview */}
          <Card className="flex flex-col items-center gap-4 bg-gray-100 rounded-3xl animate-fadeInUp border-theme shadow-blue-400  shadow-lg p-6 w-full md:w-[30%]">
            <div className="relative w-50 h-50 rounded-full overflow-hidden shadow-xl border-4   border-theme shadow-xl shadow-blue-400">
              <Image
                src={`/profile.jpg`}
                alt="Student Avatar"
                fill
                className="object-cover"
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 text-center">
              {studentProfile?.name || ""}
            </h2>
            <span className="text-gray-500 capitalize tracking-wide">
              {studentProfile?.role || ""}
            </span>

            {/* Stats */}
            <div className="flex gap-4 mt-6 w-full justify-center">
              <FeatureCard
                title={studentProfile.sessions || "-"}
                description="Sessions"
              />
              <FeatureCard
                title={studentProfile.points || "-"}
                description="Points"
              />
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
              preparing_for: studentProfile?.preparing_for || "",
              about_me: studentProfile?.about_me || "",
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
              <DetailItem label="Email" value={studentProfile?.email || "-"} />
              <DetailItem label="Phone" value={studentProfile?.phone || "-"} />
              <DetailItem
                label="Preparing For"
                value={studentProfile?.preparing_for || "-"}
              />
              <DetailItem
                label="Date Of Birth"
                value={studentProfile?.dob || "-"}
              />
              <DetailItem label="My City" value={studentProfile?.city || "-"} />

              {/* About Me */}
              <div className="col-span-1 md:col-span-2">
                <p className="text-gray-500 text-sm mb-1">About Me</p>
                <p className="text-gray-800 font-medium bg-blue-200 rounded-xl p-3">
                  {studentProfile?.about_me || "-"}
                </p>
              </div>

              {/* Skills */}
              <div className="col-span-1 md:col-span-2">
                <p className="text-gray-500 text-sm mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {studentProfile.skills ? (
                    (studentProfile?.skills).map((skill, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-theme text-white text-sm rounded-full shadow-sm"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="px-3 py-1 bg-theme text-white text-sm rounded-full shadow-sm">
                      -
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex h-[80vh] items-center justify-center text-gray-500">
          No Profile Found
        </div>
      )}
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
