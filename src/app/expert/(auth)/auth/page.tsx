"use client";
import React, { useEffect, useState } from "react";
import LeftSection from "@/app/components/LeftSection";
import RegisterForm from "@/app/components/RegisterForm";
import LoginForm from "@/app/components/LoginForm";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/providers/authProvider";

const SignUpStudent = () => {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const router = useRouter();
  const { user } = useAuthContext();

  useEffect(() => {
    if (user && user.role === "expert") {
      router.push("/expert/profile");
    }
  }, [user, router]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Slider (Hidden on mobile) */}
      <LeftSection role="expert" />

      {/* Right Form */}
      <div className="relative flex w-full md:w-1/2 items-center flex-col bg-sky-900 md:bg-gray-300 md:justify-center p-8">
        {/* Cross Button */}
        <button
          className="absolute  top-6 md:top-12 right-6 md:right-16 bg-white text-black p-2 rounded-full hover:bg-sky-900 hover:text-white transition"
          onClick={() => {
            router.push("/");
          }}
        >
          <X size={20} />
        </button>

        {mode === "signup" ? (
          <RegisterForm role="expert" setMode={setMode} />
        ) : (
          <LoginForm role="expert" setMode={setMode} />
        )}
      </div>
    </div>
  );
};

export default SignUpStudent;
