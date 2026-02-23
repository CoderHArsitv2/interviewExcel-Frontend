"use client";

import React, { useState } from "react";
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
import { setToken } from "@/providers/authProvider";

interface RegisterFormProps {
  setMode: React.Dispatch<React.SetStateAction<"signin" | "signup">>;
  role: string;
}

export default function RegisterForm({ setMode, role }: RegisterFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    try {
      const res = await post<{ access_token: string }>("/auth/register", {
        ...data,
        role: role,
      });
      const response = res;
      reset();
      setToken(response.access_token);
      router.push(`/${role}/profile`);
    } catch (err: unknown) {
      const error = err as { message?: string };
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) return;
    setIsLoading(true);
    try {
      const res = await post<{ access_token: string }>("/auth/google/login", {
        token: credentialResponse.credential,
        role: role,
      });
      const response = res;
      localStorage.setItem("access_token", response.access_token);
      router.push(`/${role}/profile`);
    } catch (err: unknown) {
      console.error(err);
      toast.error("Google sign-in failed");
    } finally {
      setIsLoading(false);
    }
  };

  const formConfig = signUpFormFields.fields as Array<
    Omit<Fields, "name"> & { name: Path<StudentSignUpFormValues> }
  >;

  return (
    <div className="flex flex-col items-center justify-center w-full px-4 py-8 sm:px-6 lg:px-8">
      {/* Mobile Logo */}
      <div className="flex justify-center mb-8 md:hidden">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-lg shadow-blue-500/20 ring-2 ring-blue-100 bg-white">
            <Image
              src="/mascot.png"
              alt="Interview Excel Mascot"
              fill
              className="object-cover p-1"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-2xl tracking-tight text-gray-900 leading-none">
              Interview
            </span>
            <span className="font-bold text-2xl tracking-tight text-blue-600 leading-none">
              Excel
            </span>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="w-full max-w-sm sm:max-w-md bg-white rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100 p-8 sm:p-10 animate-fadeInUp">
        <h1 className="text-3xl font-extrabold mb-6 text-gray-900 text-center tracking-tight">
          {role.charAt(0).toUpperCase() + role.slice(1)} Sign Up
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
                  className={`px-4 py-3.5 border rounded-xl outline-none transition-all duration-200 text-sm sm:text-base bg-gray-50/50 hover:bg-white focus:bg-white ${formState.errors[field.name]
                    ? "border-red-500 focus:ring-4 focus:ring-red-500/20"
                    : "border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
                    }`}
                />
                {formState.errors[field.name] && (
                  <p className="text-red-500 text-sm mt-1.5 font-medium px-1">
                    {formState.errors[field.name]?.message as string}
                  </p>
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={isLoading}
              className={`mt-2 bg-blue-600 hover:bg-blue-700 text-white py-3.5 px-4 rounded-full font-semibold transition-all shadow-lg shadow-blue-500/30 ${isLoading
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0"
                }`}
            >
              {isLoading ? "Signing Up..." : "Sign Up"}
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
            onClick={() => setMode("signin")}
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}
