"use client";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { FormProvider, Path, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { StudentSignInFormValues } from "@/types/schemas/SignInSchema";
import { post } from "@/providers/api";
import toast from "react-hot-toast";
import { Fields, signInFormFields } from "@/types/formConfig";
import { setToken } from "@/providers/authProvider";

interface LoginFormProps {
  setMode: React.Dispatch<React.SetStateAction<"signin" | "signup">>;
}

export default function LoginForm({ setMode }: LoginFormProps) {
  const router = useRouter();

  const methods = useForm<StudentSignInFormValues>({
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { handleSubmit, reset, formState } = methods;

  const onSubmit = async (data: StudentSignInFormValues) => {
    try {
      const res: any = await post("/auth/signin", { ...data, role: "student" });
      toast.success("Sign In successful");
      reset();
      setToken(res.access_token);
      router.push("/student/profile");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Sign In failed");
    }
  };

  const handleGoogleSignIn = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) return;
    try {
      const res: any = await post("/auth/google/login", {
        token: credentialResponse.credential,
        role: "student",
      });
      localStorage.setItem("access_token", res.access_token);
      router.push("/student/profile");
    } catch (err: any) {
      console.error(err);
      toast.error("Google sign-in failed");
    }
  };

  const formConfig = signInFormFields.fields as Array<
    Omit<Fields, "name"> & { name: Path<StudentSignInFormValues> }
  >;

  return (
    <div>
      {/* Right Form Container */}
      <div className="flex flex-col items-center justify-center w-full px-4 py-8 sm:px-6 lg:px-8">
        {/* Mobile Logo */}
        <div className="flex justify-center mb-6 md:hidden">
          <Image
            src="/interview_excel.png"
            alt="Login Illustration"
            width={160}
            height={160}
            className="mt-4"
          />
        </div>

        {/* Form Card */}
        <div className="w-full min-w-xs sm:min-w-sm bg-white rounded-2xl shadow-2xl shadow-gray-900 md:shadow-gray-900 p-6 sm:p-8 animate-fadeInUp">
          <h1 className="text-2xl font-bold mb-4 text-gray-800 text-center">
            Student Sign In
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
                Sign In
              </button>
            </form>
          </FormProvider>

          {/* Divider + Google */}
          <div className="mt-6 text-center">
            <p className="mb-3 text-gray-600 text-sm">Or</p>
            <GoogleLogin
              onSuccess={handleGoogleSignIn}
              onError={() => toast.error("Google sign-in failed")}
            />
          </div>

          {/* Switch to Sign Up */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <button
              onClick={() => setMode("signup")}
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
