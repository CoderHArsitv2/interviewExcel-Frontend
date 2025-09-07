"use client";

import { useAuthContext } from "@/providers/authProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { authenticatedGet } from "@/providers/api";
import { formatDate, formatDateForInput } from "@/utils/helpers";
import FeatureCard from "@/app/components/FeatureCard";
import EditProfileModal from "@/app/components/EditProfileModal";
import { useRouter } from "next/navigation";

// Types (adjust as per your backend response for experts)
interface ExpertProfileResponse {
  full_name: string;
  email: string;
  phone: string;
  city: string;
  dob: string;
  about_me: string;
  expertise: string[];
  role: string;
  sessions: number;
  students_mentored: number;
  experience_years: number;
}

const ExpertProfilePage = () => {
  const router = useRouter();
  const { user } = useAuthContext();
  const [expertProfile, setExpertProfile] =
    useState<ExpertProfileResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleSave = (updatedProfile: any) => {
    setExpertProfile(updatedProfile);
    // optionally call API to persist changes
  };
  useEffect(() => {
    if (user && user.role !== "expert") {
      router.replace(`/${user.role}/profile`);
    }
  }, [user]);

  useEffect(() => {
    const fetchExpertProfile = async () => {
      try {
        setIsLoading(true);
        const res: ExpertProfileResponse = await authenticatedGet(
          "/expert/profile"
        );
        setExpertProfile(res);
      } catch (error) {
        console.error("Error fetching expert profile:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchExpertProfile();
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
      ) : expertProfile !== null ? (
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Card: Profile Overview */}
          <Card className="flex flex-col items-center gap-4 bg-gray-100 rounded-3xl animate-fadeInUp border border-expert shadow-lg shadow-[#805617] p-6 w-full md:w-[30%]">
            <div className="relative w-50 h-50 rounded-full overflow-hidden shadow-xl border-4 border-[#805617] shadow-lg shadow-[#805617]">
              <Image
                src={`/mascot.png`}
                alt="Expert Avatar"
                fill
                className="object-fill"
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 text-center">
              {expertProfile?.full_name}
            </h2>
            <span className="text-gray-500 capitalize tracking-wide">
              {expertProfile?.role || "Expert"}
            </span>

            {/* Stats */}
            <div className="flex gap-4 mt-6 w-full justify-center">
              <FeatureCard
                role="expert"
                title={String(expertProfile.sessions || "-")}
                description="Sessions"
              />
              <FeatureCard
                role="expert"
                title={String(expertProfile.students_mentored || "-")}
                description="Students"
              />
              <FeatureCard
                role="expert"
                title={String(expertProfile.experience_years || "-")}
                description="Years Exp."
              />
            </div>

            <button
              className="mt-6 px-6 py-2 bg-[#805617] hover:bg-[#805617] text-white rounded-full shadow-md transition"
              onClick={() => setIsModalOpen(true)}
            >
              Edit Profile
            </button>
          </Card>
          <EditProfileModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            profile={{
              name: expertProfile?.full_name || "",
              phone: expertProfile?.phone || "",
              city: expertProfile?.city || "",
              dob: formatDateForInput(expertProfile?.dob),
              about_me: expertProfile?.about_me || "",
              expertise: expertProfile?.expertise || [],
            }}
            onSave={handleSave}
          />

          {/* Right Card: Detailed Info */}
          <Card className="flex flex-col gap-6 animate-fadeInUp rounded-3xl border border-[#805617] bg-gray-100 shadow-lg shadow-[#805617] p-6 w-full md:w-[65%]">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-[#805617]">
                Expert Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DetailItem label="Email" value={expertProfile?.email || "-"} />
              <DetailItem label="Phone" value={expertProfile?.phone || "-"} />
              <DetailItem
                label="Date Of Birth"
                value={formatDate(expertProfile?.dob)}
              />
              <DetailItem label="My City" value={expertProfile?.city || "-"} />

              {/* About Me */}
              <div className="col-span-1 md:col-span-2">
                <p className="text-gray-500 text-sm mb-1">About Me</p>
                <p className="text-gray-800 font-medium bg-[#d2aa6f] rounded-xl p-3">
                  {expertProfile?.about_me || "-"}
                </p>
              </div>

              {/* Expertise */}
              <div className="col-span-1 md:col-span-2">
                <p className="text-gray-500 text-sm mb-2">Expertise</p>
                <div className="flex flex-wrap gap-2">
                  {expertProfile.expertise ? (
                    (expertProfile?.expertise).map((skill, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-[#805617;] text-white text-sm rounded-full shadow-sm"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="px-3 py-1 bg-[#805617;] text-white text-sm rounded-full shadow-sm">
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

export default ExpertProfilePage;
