"use client";

import React, { useState } from "react";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { FormProvider, Path, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { StudentSignInFormValues } from "@/types/schemas/SignInSchema";
import { post } from "@/providers/api";
import toast from "react-hot-toast";
import { Fields, signInFormFields } from "@/types/formConfig";
import { setToken } from "@/providers/authProvider";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, UserCheck } from "lucide-react";

interface LoginFormProps {
  setMode: React.Dispatch<React.SetStateAction<"signin" | "signup">>;
  role: string;
}

export default function LoginForm({ setMode, role }: LoginFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isStudent = role === "student";

  const methods = useForm<StudentSignInFormValues>({
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { handleSubmit, reset, formState } = methods;

  const onSubmit = async (data: StudentSignInFormValues) => {
    setIsLoading(true);
    try {
      const res = await post<{ access_token: string }>("/auth/signin", { ...data, role: role });
      reset();
      setToken(res.access_token);
      router.push(`/${role}/profile`);
    } catch (err: unknown) {
      const error = err as { message?: string };
      console.warn(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) return;
    setIsLoading(true);
    try {
      const res = await post<{ access_token: string }>("/auth/google/login", {
        token: credentialResponse.credential,
        role: role,
      });
      localStorage.setItem("access_token", res.access_token);
      router.push(`/${role}/profile`);
    } catch (err: unknown) {
      console.warn(err);
    } finally {
      setIsLoading(false);
    }
  };

  const formConfig = signInFormFields.fields as Array<
    Omit<Fields, "name"> & { name: Path<StudentSignInFormValues> }
  >;

  const getFieldIcon = (name: string) => {
    if (name === "email") return <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500" />;
    if (name === "password") return <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500" />;
    return null;
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      {/* Mobile Logo Bar */}
      <div className="flex justify-center mb-6 md:hidden">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative w-10 h-10 rounded-2xl overflow-hidden shadow-md shadow-purple-500/20 ring-2 ring-purple-200/60 dark:ring-purple-500/30 bg-white flex items-center justify-center">
            <Image
              src="/mascot.png"
              alt="Interview Excel Mascot"
              fill
              className="object-cover p-1"
            />
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white">
            Interview<span className="text-gradient font-extrabold">Excel</span>
          </span>
        </Link>
      </div>

      {/* Main Form Card */}
      <div className="w-full max-w-md bg-white dark:bg-slate-900/90 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-purple-950/30 border border-purple-100/80 dark:border-white/10 p-7 sm:p-9 backdrop-blur-xl transition-all">
        {/* Header Badge & Title */}
        <div className="text-center mb-7">
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 ${
              isStudent
                ? "bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40"
                : "bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isStudent ? "Candidate Sign In" : "Mentor Sign In"}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Welcome Back
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {isStudent
              ? "Access your mock interview sessions & scorecards"
              : "Access your expert dashboard & scheduled slots"}
          </p>
        </div>

        {/* Form Fields */}
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {formConfig.map((field) => {
              const isPassword = field.name === "password";
              const hasError = !!formState.errors[field.name];

              return (
                <div key={field.name} className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>{field.label}</span>
                    {field.required && <span className="text-rose-500 font-normal">*</span>}
                  </label>

                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 pointer-events-none">
                      {getFieldIcon(field.name)}
                    </div>

                    <input
                      type={isPassword ? (showPassword ? "text" : "password") : field.type}
                      placeholder={field.placeholder || `Enter your ${field.label.toLowerCase()}`}
                      {...methods.register(field.name)}
                      className={`w-full pl-10 pr-10 py-3 rounded-2xl border text-sm sm:text-base outline-none transition-all duration-200 bg-slate-50/70 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 hover:bg-white dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 ${
                        hasError
                          ? "border-rose-500 focus:ring-4 focus:ring-rose-500/20"
                          : "border-slate-200 dark:border-slate-700 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-4 focus:ring-purple-500/15"
                      }`}
                    />

                    {isPassword && (
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>

                  {hasError && (
                    <p className="text-rose-500 text-xs font-medium px-1">
                      {formState.errors[field.name]?.message as string}
                    </p>
                  )}
                </div>
              );
            })}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full mt-2 py-3.5 px-4 rounded-2xl font-bold text-sm sm:text-base text-white transition-all duration-200 flex items-center justify-center gap-2 shadow-lg ${
                isStudent
                  ? "bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-purple-500/25 hover:shadow-purple-500/40"
                  : "bg-gradient-to-r from-amber-600 via-amber-700 to-indigo-800 hover:from-amber-700 hover:to-indigo-900 shadow-amber-500/25 hover:shadow-amber-500/40"
              } ${
                isLoading
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:scale-[1.01] active:scale-[0.99]"
              }`}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing In...
                </span>
              ) : (
                <>
                  <span>Sign In as {isStudent ? "Candidate" : "Mentor"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </FormProvider>

        {/* Divider + Google OAuth */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-white/10 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Or continue with
          </p>
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSignIn}
              onError={() => toast.error("Google sign-in failed")}
            />
          </div>
        </div>

        {/* Switch to Sign Up */}
        <div className="mt-6 text-center text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Don’t have an account?{" "}
          <button
            onClick={() => setMode("signup")}
            className="text-purple-600 dark:text-purple-400 font-bold hover:underline"
          >
            Create an Account
          </button>
        </div>

        {/* Portal Switch Link */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/10 text-center">
          <Link
            href={isStudent ? "/expert/auth" : "/student/auth"}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-300 transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>
              {isStudent
                ? "Looking for Mentor Portal? Sign In as Expert →"
                : "Are you a candidate? Sign In as Candidate →"}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
