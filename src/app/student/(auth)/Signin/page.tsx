"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Image from "next/image";

const features = [
  {
    title: "Welcome Back!",
    description: "Sign in to continue your learning journey with us.",
  },
  {
    title: "Stay Connected",
    description: "Access your courses and progress anytime, anywhere.",
  },
  {
    title: "Learn Smarter",
    description: "Get personalized recommendations for faster growth.",
  },
];

export default function StudentSignIn() {
  const [current, setCurrent] = useState(0);
  const router = useRouter();
  // Auto-slide every 4s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    console.log("Sign In Data", data);
  };

  const handleGoogleSignIn = (response: any) => {
    console.log("Google Sign In Success", response);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Slider (Hidden on mobile) */}
      <div className="hidden md:flex w-1/2 bg-sky-900 text-white flex-col items-center relative overflow-hidden">
        <div>
          <Image
            src="/interview_excel.png"
            alt="Signup Illustration"
            width={200}
            height={200}
            className="right-10 justify-center mt-10"
          ></Image>
        </div>
        <div className="inset-0 flex items-center justify-center p-25 mt-20">
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
      </div>
      {/* Right Form */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-8">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl shadow-sky-600 p-8">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">
            Student Sign In
          </h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <input
              {...register("email", { required: "Email is required" })}
              placeholder="Email"
              className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.email && <p className="text-red-500 text-sm">{}</p>}

            <input
              {...register("password", { required: "Password is required" })}
              type="password"
              placeholder="Password"
              className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.password && <p className="text-red-500 text-sm">{}</p>}

            <button
              type="submit"
              className="bg-sky-800 text-white p-3 rounded-lg font-semibold hover:bg-sky-900 transition"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="mb-3 text-gray-600">Or sign in with Google</p>
            <GoogleLogin
              onSuccess={handleGoogleSignIn}
              onError={() => alert("Google sign-in failed")}
            />
          </div>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <button
              onClick={() => router.push("/student/Signup")}
              className="text-blue-600 font-semibold hover:underline"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
