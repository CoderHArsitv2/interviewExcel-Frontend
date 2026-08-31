"use client";

import React, { useEffect, useState } from "react";
import LeftSection from "@/app/components/LeftSection";
import RegisterForm from "@/app/components/RegisterForm";
import LoginForm from "@/app/components/LoginForm";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/providers/authProvider";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const ExpertAuthPage = () => {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const router = useRouter();
  const { user } = useAuthContext();

  useEffect(() => {
    if (user && user.role === "expert") {
      router.push("/expert/profile");
    }
  }, [user, router]);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Left Slider Showcase */}
      <LeftSection role="expert" />

      {/* Right Form Area */}
      <div className="relative flex w-full md:w-1/2 items-center justify-center p-6 sm:p-10 bg-slate-50/70 dark:bg-slate-950 min-h-screen">
        {/* Top Control Bar (Theme Toggle + Back Button) */}
        <div className="absolute top-6 right-6 sm:top-8 sm:right-8 flex items-center gap-3 z-20">
          <ThemeToggle />

          <button
            onClick={() => router.push("/")}
            className="p-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-all shadow-sm"
            aria-label="Back to home"
            title="Back to home"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auth Form (Sign In / Sign Up) */}
        <div className="w-full max-w-md my-auto py-12">
          {mode === "signup" ? (
            <RegisterForm role="expert" setMode={setMode} />
          ) : (
            <LoginForm role="expert" setMode={setMode} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpertAuthPage;
