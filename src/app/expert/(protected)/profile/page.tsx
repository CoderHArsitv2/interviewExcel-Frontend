"use client";

import { useAuthContext } from "@/providers/authProvider";
import React, { useEffect, useState } from "react";
import {
  authenticatedGet,
  authenticatedPut,
  UploadImageResponse,
} from "@/providers/api";
import { formatDate } from "@/utils/helpers";
import FeatureCard from "@/app/components/FeatureCard";
import EditExpertProfileModal from "@/app/components/EditExpertProfileModal";
import ProfileImageUpload from "@/app/components/ProfileImageUpload";
import { useRouter } from "next/navigation";
import {
  Award,
  Calendar,
  CheckCircle2,
  Edit3,
  Globe,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Star,
  Trophy,
  Users,
  ShieldCheck,
  Zap,
} from "lucide-react";

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
  profile_picture_key: string;
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

  const handlePhotoUploaded = async (result: UploadImageResponse) => {
    if (!expertProfile) return;
    await authenticatedPut("/expert/profile", {
      full_name: expertProfile.full_name,
      phone: expertProfile.phone || "",
      city: expertProfile.city || "",
      dob: expertProfile.dob || null,
      expertise: expertProfile.expertise || "",
      education: expertProfile.education || "",
      about_me: expertProfile.about_me || "",
      achievements: expertProfile.achievements || "",
      fees_per_session: expertProfile.fees_per_session || 0,
      experience_years: expertProfile.experience_years || 0,
      role: "expert",
      profile_picture_key: result.file_key,
    });
    await fetchExpertProfile();
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
      <div className="flex h-[70vh] items-center justify-center text-slate-500">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center text-slate-500">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading expert details...</span>
        </div>
      </div>
    );
  }

  if (!expertProfile) {
    return (
      <div className="flex h-[70vh] items-center justify-center text-slate-500">
        No Expert Profile Found
      </div>
    );
  }

  // Parse comma-separated skills/expertise if any
  const expertiseList = expertProfile.expertise
    ? expertProfile.expertise.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const achievementsList = expertProfile.achievements
    ? expertProfile.achievements.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Left Column: Profile Card & Photo (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Main Profile Summary Card */}
          <div className="profile-card p-6 sm:p-7 flex flex-col items-center text-center relative overflow-hidden">
            {/* Ambient subtle glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            {/* Avatar doubles as the photo uploader */}
            <div className="mb-4 w-full max-w-[15rem]">
              <ProfileImageUpload
                variant="inline"
                verified
                uploadUrl="/upload/image"
                currentImageUrl={expertProfile.profile_picture_url}
                fallbackImageUrl={expertProfile.picture}
                fallbackName={
                  expertProfile.full_name || user?.full_name || "Expert"
                }
                role="expert"
                onUploaded={handlePhotoUploaded}
                onImageError={fetchExpertProfile}
              />
            </div>

            {/* Name & Role */}
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {expertProfile.full_name}
            </h2>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="profile-badge-expert">
                ⭐ Verified Expert
              </span>
              {expertProfile.rating > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/60 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {expertProfile.rating.toFixed(1)}
                </span>
              )}
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full mt-6">
              <FeatureCard
                role="expert"
                title={`₹${Math.round(expertProfile.fees_per_session / 100)}`}
                description="Per Session"
                icon={Zap}
              />
              <FeatureCard
                role="expert"
                title={String(expertProfile.student_mentored || 0)}
                description="Mentored"
                icon={Users}
              />
              <FeatureCard
                role="expert"
                title={`${expertProfile.experience_years || 0} yrs`}
                description="Experience"
                icon={Award}
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2.5 w-full mt-6">
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn-expert-primary w-full flex items-center justify-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>

              <button
                onClick={() => router.push("/expert/sessions")}
                className="btn-expert-secondary w-full flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Manage Availability</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Credentials & Information (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Main Credentials Card */}
          <div className="profile-card p-6 sm:p-8 flex flex-col gap-8">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-white/10">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-500" />
                  Expert Profile Overview
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Your public mentorship profile, specializations, and booking details.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {expertProfile.is_available ? "Available for Sessions" : "Currently Offline"}
                </span>
              </div>
            </div>

            {/* About Me / Bio */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                About & Mentorship Philosophy
              </h4>
              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50/70 dark:bg-slate-800/40 p-4 sm:p-5 rounded-2xl border border-slate-200/60 dark:border-white/5">
                {expertProfile.about_me ||
                  expertProfile.bio ||
                  "No bio provided yet. Click 'Edit Profile' to add a detailed summary of your expertise and background."}
              </p>
            </div>

            {/* Expertise & Specializations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Expertise */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Core Expertise & Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {expertiseList.length > 0 ? (
                    expertiseList.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-xl text-xs font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">None listed</span>
                  )}
                </div>
              </div>

              {/* Specializations / Domains */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5 flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                  Specializations
                </h4>
                <div className="flex flex-wrap gap-2">
                  {expertProfile.specializations && expertProfile.specializations.length > 0 ? (
                    expertProfile.specializations.map((spec, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-xl text-xs font-bold bg-purple-50 dark:bg-purple-950/50 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40"
                      >
                        {spec}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">None listed</span>
                  )}
                </div>
              </div>
            </div>

            {/* Achievements */}
            {achievementsList.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                  Key Achievements & Career Highlights
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {achievementsList.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-white/5 flex items-start gap-2 text-xs font-medium text-slate-700 dark:text-slate-300"
                    >
                      <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Details Grid: Education, Contact & Personal */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                Account & Consultation Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                <div className="detail-item-card">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email Address</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {expertProfile.email || "-"}
                  </p>
                </div>

                <div className="detail-item-card">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    <Phone className="w-3.5 h-3.5" />
                    <span>Phone Number</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {expertProfile.phone || "-"}
                  </p>
                </div>

                <div className="detail-item-card">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>City</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {expertProfile.city || "-"}
                  </p>
                </div>

                <div className="detail-item-card">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Date of Birth</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {formatDate(expertProfile.dob)}
                  </p>
                </div>

                <div className="detail-item-card">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Education</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {expertProfile.education || "-"}
                  </p>
                </div>

                <div className="detail-item-card">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    <Globe className="w-3.5 h-3.5" />
                    <span>Languages</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {expertProfile.languages && expertProfile.languages.length > 0
                      ? expertProfile.languages.join(", ")
                      : "English"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Edit Profile Modal */}
      <EditExpertProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        profile={{
          full_name: expertProfile.full_name,
          expertise: expertProfile.expertise || "",
          fees_per_session: expertProfile.fees_per_session / 100 || null,
          about_me: expertProfile.about_me || "",
          experience: expertProfile.experience_years || 0,
          achievements: expertProfile.achievements || "",
          city: expertProfile.city || "",
          dob: expertProfile.dob || "",
          phone: expertProfile.phone || "",
          profile_picture_key: expertProfile.profile_picture_key || null,
        }}
        onSave={handleSave}
      />
    </>
  );
};

export default ExpertProfilePage;
