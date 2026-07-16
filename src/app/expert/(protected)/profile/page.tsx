"use client";

import { useAuthContext } from "@/providers/authProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { authenticatedGet } from "@/providers/api";
import { formatDate } from "@/utils/helpers";
import FeatureCard from "@/app/components/FeatureCard";
import EditExpertProfileModal from "@/app/components/EditExpertProfileModal";
import { useRouter } from "next/navigation";

// Types
interface ExpertProfileResponse {
  id: number;
  user_uuid: string;
  full_name: string;
  email: string;
  picture: string;
  phone: string | null;
  role: string;
  bio: string;
  languages: string[] | null;
  specializations: string[] | null;
  expertise: string;
  education: string;
  experience_years: number;
  profile_picture_url: string;
  fees_per_session: number;
  rating: number;
  total_sessions: number;
  verification_status: string;
  is_available: boolean;
  student_mentored: number;
  city: string;
  dob: string;
  about_me: string;
  achievements: string;
}

const ExpertProfilePage = () => {
  const router = useRouter();
  const { user } = useAuthContext();
  const [expertProfile, setExpertProfile] =
    useState<ExpertProfileResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleSave = () => {
    fetchExpertProfile();
  };

  useEffect(() => {
    if (user && user.role !== "expert") {
      router.replace(`/${user.role}/profile`);
    }
  }, [user, router]);

  const fetchExpertProfile = async () => {
    try {
      setIsLoading(true);
      const res: ExpertProfileResponse = await authenticatedGet(
        "/expert/profile"
      );
      setExpertProfile(res);
    } catch (error) {
      console.warn("Error fetching expert profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
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
    <div className="w-[90vw] max-w-[1200px] mx-auto mb-10 my-12">
      {isLoading ? (
        <div className="flex h-[80vh] items-center justify-center text-gray-500">
          Loading profile...
        </div>
      ) : expertProfile !== null ? (
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Card: Profile Overview */}
          <Card className="glass flex flex-col items-center gap-4 rounded-3xl animate-fadeInUp border border-white/40 shadow-xl p-6 w-full md:w-[30%]">
            <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-amber-400 shadow-lg shadow-amber-200/50">
              <Image
                src={`/mascot.png`}
                alt="Expert Avatar"
                fill
                className="object-cover"
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
                title={"₹" + String(expertProfile.fees_per_session / 100 || "-")}
                description="Fees"
              />
              <FeatureCard
                role="expert"
                title={String(expertProfile.student_mentored || "-")}
                description="Students"
              />
              <FeatureCard
                role="expert"
                title={String(expertProfile.experience_years || "-")}
                description="Years Exp."
              />
            </div>

            <button
              className="mt-6 px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full shadow-lg shadow-primary/20 transition"
              onClick={() => setIsModalOpen(true)}
            >
              Edit Profile
            </button>

            {/* NEW Button to manage availability */}
            <button
              className="mt-3 px-6 py-2 bg-white/70 hover:bg-white text-amber-700 font-semibold border border-amber-200 rounded-full shadow-md transition"
              onClick={() => router.push("/expert/sessions")}
            >
              Manage Availability
            </button>
          </Card>

          {/* Modal */}
          <EditExpertProfileModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            profile={{
              full_name: expertProfile.full_name,
              expertise: expertProfile?.expertise || "",
              fees_per_session: expertProfile?.fees_per_session / 100 || null,
              about_me: expertProfile.about_me || "",
              experience: expertProfile.experience_years || 0,
              achievements: expertProfile.achievements || "",
              city: expertProfile.city || "",
              dob: expertProfile.dob || "",
              phone: expertProfile.phone || "",
            }}
            onSave={handleSave}
          />

          {/* Right Card: Detailed Info */}
          <Card className="glass flex flex-col gap-6 animate-fadeInUp rounded-3xl border border-white/40 shadow-xl p-6 w-full md:w-[65%]">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-primary">
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
              <DetailItem label="City" value={expertProfile?.city || "-"} />
              <DetailItem
                label="Verification Status"
                value={expertProfile?.verification_status || "-"}
              />
              <DetailItem
                label="Rating"
                value={String(expertProfile?.rating || 0)}
              />
              <DetailItem
                label="Total Sessions"
                value={String(expertProfile?.total_sessions || 0)}
              />
              <DetailItem
                label="Education"
                value={expertProfile?.education || "-"}
              />
            </CardContent>

            {/* Full-width sections */}
            <div className="space-y-2 flex justify-between w-full px-6 pr-63">
              {/* Languages */}
              <div>
                <p className="text-gray-500 text-sm mb-2">Languages</p>
                <div className="flex flex-wrap gap-2">
                  {expertProfile.languages &&
                    expertProfile.languages.length > 0 ? (
                    expertProfile.languages.map((lang, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-amber-100 text-amber-700 text-sm rounded-full shadow-sm"
                      >
                        {lang}
                      </span>
                    ))
                  ) : (
                    <span className="px-3 py-1 bg-amber-200 text-amber-600 text-sm rounded-full shadow-sm">
                      -
                    </span>
                  )}
                </div>
              </div>

              {/* Specializations */}
              <div>
                <p className="text-gray-500 text-sm mb-2">Specializations</p>
                <div className="flex flex-wrap gap-2">
                  {expertProfile.specializations &&
                    expertProfile.specializations.length > 0 ? (
                    expertProfile.specializations.map((spec, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-amber-100 text-amber-700 text-sm rounded-full shadow-sm"
                      >
                        {spec}
                      </span>
                    ))
                  ) : (
                    <span className="px-3 py-1 bg-amber-200 text-amber-600 text-sm rounded-full shadow-sm">
                      -
                    </span>
                  )}
                </div>
              </div>
            </div>
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
