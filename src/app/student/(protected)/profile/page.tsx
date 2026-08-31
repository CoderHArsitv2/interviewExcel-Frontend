"use client";

import { useAuthContext } from "@/providers/authProvider";
import React, { useEffect, useState } from "react";
import { StudentProfileResponse } from "./type";
import EditProfileModal from "@/app/components/EditProfileModal";
import ProfileImageUpload from "@/app/components/ProfileImageUpload";
import FeatureCard from "@/app/components/FeatureCard";
import {
  authenticatedGet,
  authenticatedPut,
  UploadImageResponse,
} from "@/providers/api";
import { useRouter } from "next/navigation";
import {
  Calendar,
  CalendarDays,
  Edit,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Star,
  Target,
  Trophy,
  User,
} from "lucide-react";
import { formatDate } from "@/utils/helpers";

const StudentProfilePage = () => {
  const { user } = useAuthContext();
  const [studentProfile, setStudentProfile] =
    useState<StudentProfileResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  const fetchStudentProfile = async () => {
    try {
      setIsLoading(true);
      const res: StudentProfileResponse = await authenticatedGet(
        "/student/profile"
      );
      setStudentProfile(res);
    } catch (error) {
      console.warn("Error fetching student profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mirrors the expert flow: persist the returned file_key onto the profile,
  // otherwise the upload succeeds but the photo is dropped on the next fetch.
  const handlePhotoUploaded = async (result: UploadImageResponse) => {
    if (!studentProfile) return;
    await authenticatedPut("/student/profile", {
      full_name: studentProfile.full_name,
      phone: studentProfile.phone || "",
      city: studentProfile.city || "",
      dob: studentProfile.dob || null,
      preparing_for: studentProfile.preparing_for || "",
      about_me: studentProfile.about_me || "",
      skills: studentProfile.skills || [],
      role: "student",
      profile_picture_key: result.file_key,
    });
    await fetchStudentProfile();
  };

  useEffect(() => {
    if (user && user.role !== "student") {
      router.replace(`/${user.role}/profile`);
    }
  }, [user, router]);

  useEffect(() => {
    fetchStudentProfile();
  }, [isModalOpen]);

  if (!user || isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  if (!studentProfile) {
    return (
      <div className="flex h-[70vh] items-center justify-center text-slate-500 dark:text-slate-400">
        No Profile Found
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Left Column: Profile Card (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6 h-fit lg:sticky lg:top-4">
          <div className="profile-card p-6 sm:p-7 flex flex-col items-center text-center relative overflow-hidden">
            {/* Ambient subtle glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            {/* Avatar doubles as the photo uploader */}
            <div className="mb-4 w-full max-w-[15rem]">
              <ProfileImageUpload
                variant="inline"
                uploadUrl="/upload/image"
                currentImageUrl={studentProfile.profile_picture_url}
                fallbackImageUrl={studentProfile.picture}
                fallbackName={
                  studentProfile.full_name || user?.full_name || "Student"
                }
                role="student"
                onUploaded={handlePhotoUploaded}
                onImageError={fetchStudentProfile}
              />
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {studentProfile.full_name || "Student"}
            </h2>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="profile-badge-student capitalize">
                🎓 {studentProfile.role || "Student"}
              </span>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 w-full mt-6">
              <FeatureCard
                role="student"
                title={String(studentProfile.sessions || 0)}
                description="Sessions"
                icon={CalendarDays}
              />
              <FeatureCard
                role="student"
                title={String(studentProfile.points || 0)}
                description="Points"
                icon={Star}
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2.5 w-full mt-6">
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn-student-primary w-full flex items-center justify-center gap-2"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>

              <button
                onClick={() => router.push("/student/sessions")}
                className="btn-student-secondary w-full flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>My Sessions</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Details (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="profile-card p-6 sm:p-8 flex flex-col gap-8">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-white/10">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-500" />
                  Student Details
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Your profile as mentors see it when you book a session.
                </p>
              </div>

              {studentProfile.preparing_for && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" />
                  Preparing for {studentProfile.preparing_for}
                </span>
              )}
            </div>

            {/* About Me */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                About Me
              </h4>
              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50/70 dark:bg-slate-800/40 p-4 sm:p-5 rounded-2xl border border-slate-200/60 dark:border-white/5">
                {studentProfile.about_me ||
                  "No bio added yet. Click 'Edit Profile' to tell mentors what you're working towards."}
              </p>
            </div>

            {/* Skills */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {studentProfile.skills && studentProfile.skills.length > 0 ? (
                  studentProfile.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-xl text-xs font-bold bg-purple-50 dark:bg-purple-950/50 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">
                    No skills listed
                  </span>
                )}
              </div>
            </div>

            {/* Details Grid */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                Account Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                <div className="detail-item-card">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email Address</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {studentProfile.email || "-"}
                  </p>
                </div>

                <div className="detail-item-card">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    <Phone className="w-3.5 h-3.5" />
                    <span>Phone Number</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {studentProfile.phone || "-"}
                  </p>
                </div>

                <div className="detail-item-card">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>City</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {studentProfile.city || "-"}
                  </p>
                </div>

                <div className="detail-item-card">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Date of Birth</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {formatDate(studentProfile.dob)}
                  </p>
                </div>

                <div className="detail-item-card">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    <Target className="w-3.5 h-3.5" />
                    <span>Preparing For</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {studentProfile.preparing_for || "-"}
                  </p>
                </div>

                <div className="detail-item-card">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    <Trophy className="w-3.5 h-3.5" />
                    <span>Points Earned</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {studentProfile.points || "0"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        profile={{
          name: studentProfile.full_name || "",
          phone: studentProfile.phone || "",
          city: studentProfile.city || "",
          dob: studentProfile.dob || "",
          preparing_for: studentProfile.preparing_for || "",
          about_me: studentProfile.about_me || "",
          skills: studentProfile.skills || [],
        }}
        onSave={() => {
          setIsModalOpen(false);
        }}
      />
    </>
  );
};

export default StudentProfilePage;
