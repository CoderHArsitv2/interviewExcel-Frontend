"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { FormProvider, useForm } from "react-hook-form";
import type { Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { post } from "@/providers/api";
import Image from "next/image";
import { StudentSignUpFormValues } from "@/types/schemas/SignUpSchema";
import { Fields, signUpFormFields } from "@/types/formConfig";
import toast from "react-hot-toast";

interface RegisterFormProps {
  setMode: React.Dispatch<React.SetStateAction<"signin" | "signup">>;
}

export default function RegisterForm(props: RegisterFormProps) {
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

  const { handleSubmit, formState } = methods;

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
      const res: any = await post("/auth/google/login", {
        token: credentialResponse.credential,
        role: "student",
      });
      localStorage.setItem("access_token", res.access_token);
      router.push("/student/dashboard");
    } catch (err: any) {
      console.error(err);
      toast.error("Google sign-in failed");
    }
  };

  const formConfig = signUpFormFields.fields as Array<
    Omit<Fields, "name"> & { name: Path<StudentSignUpFormValues> }
  >;

  return (
    <div className="flex flex-col items-center justify-center w-full px-4 py-8 sm:px-6 lg:px-8">
      {/* Mobile Logo */}
      <div className="flex justify-center mb-6 md:hidden">
        <Image
          src="/interview_excel.png"
          alt="Signup Illustration"
          width={160}
          height={160}
          className="mt-4"
        />
      </div>

      {/* Form Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl shadow-gray-900 md:shadow-gray-900 p-6 sm:p-8 animate-fadeInUp">
        <h1 className="text-2xl font-bold mb-4 text-gray-800 text-center">
          Student Sign Up
        </h1>

        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {formConfig.map((field) => (
              <div key={field.name} className="flex flex-col">
                <input
                  type={field.type}
                  placeholder={field.placeholder || field.label}
                  {...methods.register(field.name)}
                  className={`p-3 border rounded-lg outline-none transition text-sm sm:text-base ${
                    formState.errors[field.name]
                      ? "border-red-500"
                      : "border-gray-300 focus:ring-2 focus:ring-blue-500"
                  }`}
                />
                {formState.errors[field.name] && (
                  <p className="text-red-500 text-sm mt-1">
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
        </FormProvider>

        {/* Divider + Google */}
        <div className="mt-6 text-center">
          <p className="mb-3 text-gray-600 text-sm">Or</p>
          <GoogleLogin
            onSuccess={handleGoogleSignUp}
            onError={() => toast.error("Google sign-in failed")}
            text="signup_with"
          />
        </div>

        {/* Switch to Sign In */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button
            onClick={() => props.setMode("signin")}
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}
