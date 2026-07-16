import { useState } from "react";
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
  role: string;
}

export default function LoginForm({ setMode, role }: LoginFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <div>
      {/* Right Form Container */}
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
            {role.charAt(0).toUpperCase() + role.slice(1)} Sign In
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
                {isLoading ? "Signing In..." : "Sign In"}
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
