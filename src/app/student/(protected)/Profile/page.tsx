"use client";

import { useAuthContext } from "@/providers/authProvider";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { StudentProfileResponse } from "./type";
import EditProfileModal from "@/app/components/EditProfileModal";
import { authenticatedGet } from "@/providers/api";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Mail, Phone, Calendar, MapPin, User, Target } from "lucide-react";
import { formatDate } from "@/utils/helpers"; 

const StudentProfilePage = () => {
  const { user } = useAuthContext();
  const [studentProfile, setStudentProfile] =
    useState<StudentProfileResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  useEffect(() => {
    if (user && user.role !== "expert") {
      router.replace(`/${user.role}/profile`);
    }
  }, [user, router]);

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
  }, [isModalOpen]);

  if (!user || isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center text-gray-500">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mb-10 my-6 px-4">
      {studentProfile !== null ? (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Card: Profile Overview */}
          <div className="glass rounded-3xl border border-white/40 p-8 w-full lg:w-[35%] flex flex-col items-center text-center h-fit sticky top-6">
            <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-xl mb-6 ring-4 ring-primary/20">
              <Image
                src={`/profile.jpg`}
                alt="Student Avatar"
                fill
                className="object-cover"
              />
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-1">
              {studentProfile?.full_name || "Student"}
            </h2>
            <Badge variant="secondary" className="mb-6 capitalize px-3 py-1 text-sm bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
              {studentProfile?.role || "Student"}
            </Badge>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 w-full mb-8">
              <div className="bg-white/50 p-4 rounded-2xl border border-white/60 shadow-sm">
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Sessions</p>
                <p className="text-2xl font-bold text-primary">{studentProfile.sessions || "-"}</p>
              </div>
              <div className="bg-white/50 p-4 rounded-2xl border border-white/60 shadow-sm">
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Points</p>
                <p className="text-2xl font-bold text-primary">{studentProfile.points || "-"}</p>
              </div>
            </div>

            <Button
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 rounded-xl py-6"
              onClick={() => setIsModalOpen(true)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>

          <EditProfileModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            profile={{
              name: studentProfile?.full_name || "",
              phone: studentProfile?.phone || "",
              city: studentProfile?.city || "",
              dob: studentProfile?.dob || "",
              preparing_for: studentProfile?.preparing_for || "",
              about_me: studentProfile?.about_me || "",
              skills: studentProfile?.skills || [],
            }}
            onSave={() => {
              setIsModalOpen(false);
            }}
          />

          {/* Right Card: Detailed Info */}
          <div className="glass rounded-3xl border border-white/40 p-8 w-full lg:w-[65%] space-y-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <User className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Student Details</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
              <DetailItem icon={<Mail className="w-4 h-4" />} label="Email" value={studentProfile?.email || "-"} />
              <DetailItem icon={<Phone className="w-4 h-4" />} label="Phone" value={studentProfile?.phone || "-"} />
              <DetailItem icon={<Target className="w-4 h-4" />} label="Preparing For" value={studentProfile?.preparing_for || "-"} />
              <DetailItem icon={<Calendar className="w-4 h-4" />} label="Date Of Birth" value={formatDate(studentProfile?.dob)} />
              <DetailItem icon={<MapPin className="w-4 h-4" />} label="City" value={studentProfile?.city || "-"} />
            </div>

            {/* About Me */}
            <div className="border-t border-gray-200/50 pt-8">
              <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-3">About Me</p>
              <p className="text-gray-700 leading-relaxed bg-white/50 p-4 rounded-xl border border-white/60">
                {studentProfile?.about_me || "No bio added yet."}
              </p>
            </div>

            {/* Skills */}
            <div className="border-t border-gray-200/50 pt-8">
              <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-3">Skills</p>
              <div className="flex flex-wrap gap-2">
                {studentProfile.skills && studentProfile.skills.length > 0 ? (
                  studentProfile.skills.map((skill, i) => (
                    <Badge key={i} variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100 px-3 py-1">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <span className="text-gray-400 italic">No skills listed</span>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex h-[80vh] items-center justify-center text-gray-500">
          No Profile Found
        </div>
      )}
    </div>
  );
};

const DetailItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-start gap-3">
    <div className="mt-1 text-gray-400">{icon}</div>
    <div>
      <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-gray-900 font-medium text-lg">{value}</p>
    </div>
  </div>
);

export default StudentProfilePage;
