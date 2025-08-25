"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { FormProvider, useForm } from "react-hook-form";
import type { Path } from "react-hook-form"; // ✅ add this
import { zodResolver } from "@hookform/resolvers/zod";
import { post } from "@/providers/api";
import Image from "next/image";
import LeftSection from "@/app/components/LeftSection";
import {
  StudentSignUpFormValues,
  studentSignUpSchema,
} from "@/types/schemas/SignUpSchema";
import { Fields, signInFormFields, signUpFormFields } from "@/types/formConfig";
import toast from "react-hot-toast";

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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const router = useRouter();

  const methods = useForm<StudentSignUpFormValues>({
    resolver: zodResolver(signUpFormFields.schema),
    mode: "onTouched",
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  const { handleSubmit, reset, formState } = methods;

  const onSubmit = async (data: StudentSignUpFormValues) => {
    try {
      await post("/auth/register", { ...data, role: "student" });
      
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Sign Up failed");
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

  // ✅ Use the sign-up fields and type the names as Path<StudentSignUpFormValues>
  const formConfig = signUpFormFields.fields as Array<
    Omit<Fields, "name"> & { name: Path<StudentSignUpFormValues> }
  >;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Slider (Hidden on mobile) */}
      <LeftSection />

      {/* Right Form */}
      <div className="flex w-full md:w-1/2 items-center flex-col bg-sky-900 md:bg-white md:justify-center p-8">
        <div className="md:hidden flex justify-center mb-8">
          <Image
            src="/interview_excel.png"
            alt="Signup Illustration"
            width={200}
            height={200}
            className="right-10 justify-center mt-10"
          />
        </div>

        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl shadow-gray-900 md:shadow-sky-600 p-8 animate-fadeInUp">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">
            Student Sign Up
          </h1>

          {/* Dynamic Form */}
          <FormProvider {...methods}>
            <div className="">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                {formConfig.map((field) => (
                  <div key={field.name} className="flex flex-col">
                    <input
                      type={field.type}
                      // use label as placeholder (your Fields type doesn't have 'placeholder')
                      placeholder={field.placeholder || field.label}
                      {...methods.register(field.name)}
                      className={`p-3 border rounded-lg  outline-none transition ${
                        formState.errors[field.name]
                          ? "border-red-500"
                          : "border-gray-300 focus:ring-2 focus:ring-blue-500 "
                      } `}
                    />
                    {formState.errors[field.name] && (
                      <p className="text-red-500 text-sm">
                        {formState.errors[field.name]?.message as string}
                      </p>
                    )}
                  </div>
                ))}

                <button
                  type="submit"
                  className="bg-sky-800 text-white p-3 rounded-lg font-semibold hover:bg-sky-900 transition"
                >
                  Sign Up
                </button>
              </form>
            </div>
          </FormProvider>

          <div className="mt-6 text-center">
            <p className="mb-3 text-gray-600">Or</p>
            <GoogleLogin
              onSuccess={handleGoogleSignUp}
              onError={() => alert("Google sign-in failed")}
              text="signup_with"
            />
            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => router.push("/student/Signin")}
                className="text-blue-600 font-semibold hover:underline"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpStudent;
