"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { studentSignUpSchema, StudentSignUpForm } from "@/formConfigs/student";
import { post } from "@/providers/api";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const features = [
  {
    title: "Learn Anytime, Anywhere",
    description:
      "Access courses and materials from any device at your convenience.",
  },
  {
    title: "Track Your Progress",
    description: "Monitor your learning journey with interactive dashboards.",
  },
  {
    title: "Expert Mentors",
    description: "Get guidance from experienced professionals in your field.",
  },
];
const SignUpStudent = () => {
  const [current, setCurrent] = useState(0);

  // Auto-slide every 4s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentSignUpForm>({
    resolver: zodResolver(studentSignUpSchema),
  });

  const onSubmit = async (data: StudentSignUpForm) => {
    try {
      await post("/auth/signup", { ...data, role: "student" });
      router.push("/student/auth/signin");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Signup failed");
    }
  };

  const handleGoogleSignUp = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) return;
    try {
      const res: any = post("/auth/google/login", {
        token: credentialResponse.credential,
        role: "student",
      });
      localStorage.setItem("access_token", res.access_token);
      router.push("/student/dashboard");
    } catch (err: any) {
      console.error(err);
      alert("Google sign-in failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Slider (Hidden on mobile) */}
      <div className="hidden md:flex w-1/2 bg-sky-900 text-white items-center justify-center relative overflow-hidden">
        <Image
          src="/mascot.png"
          alt="Signup Illustration"
          width={200}
          height={200}
          className="top-10 right-10"
        ></Image>
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-md p-8"
          >
            <h2 className="text-3xl font-bold mb-4">
              {features[current].title}
            </h2>
            <p className="text-lg opacity-90">
              {features[current].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Right Form */}
      <div className="flex w-full md:w-1/2 items-center flex-col bg-sky-900 sm:bg-white sm:justify-center  p-8">
        <div className="sm:hidden flex justify-center mb-8">
          <Image
            src="/interview_excel.png"
            alt="Signup Illustration"
            width={200}
            height={200}
            className="right-10 justify-center mt-10"
          ></Image>
        </div>

        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl shadow-gray-900 sm:shadow-sky-600 p-8">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">
            Student Sign Up
          </h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <input
              {...register("fullName", { required: "Full Name is required" })}
              placeholder="Full Name"
              className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm">{errors.fullName.message}</p>
            )}

            <input
              {...register("email", { required: "Email is required" })}
              placeholder="Email"
              className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}

            <input
              {...register("password", { required: "Password is required" })}
              type="password"
              placeholder="Password"
              className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}

            <button
              type="submit"
              className="bg-sky-800 text-white p-3 rounded-lg font-semibold hover:bg-sky-900 transition"
            >
              Sign Up
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="mb-3 text-gray-600">Or sign up with Google</p>
            <GoogleLogin
              onSuccess={handleGoogleSignUp}
              onError={() => alert("Google sign-in failed")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpStudent;
