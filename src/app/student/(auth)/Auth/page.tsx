"use client";
import React, { use, useEffect, useState } from "react";
import LeftSection from "@/app/components/LeftSection";
import RegisterForm from "@/app/components/RegisterForm";
import LoginForm from "@/app/components/LoginForm";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/providers/authProvider";

const SignUpStudent = () => {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const router = useRouter();
  const user = useAuthContext();

  useEffect(() => {
    if (user) {
      router.push("/student/profile");
    }
  }, [user]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Slider (Hidden on mobile) */}
      <LeftSection />

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
          <RegisterForm setMode={setMode} />
        ) : (
          <LoginForm setMode={setMode} />
        )}
      </div>
    </div>
  );
};

export default SignUpStudent;
