"use client";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { FormProvider, Path, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LeftSection } from "@/app/components/LeftSection";
import { StudentSignInFormValues } from "@/types/schemas/SignInSchema";
import { post } from "@/providers/api";
import toast from "react-hot-toast";
import { Fields, signInFormFields } from "@/types/formConfig";
import { setToken } from "@/providers/authProvider";

export default function StudentSignIn() {
  const router = useRouter();
  // Auto-slide every 4s

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
      console.log("Sign In response:", res);
      setToken(res.access_token); // Store token
      router.push("/student/Profile");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Sign In failed");
    }
  };

  const handleGoogleSignIn = async (credentialResponse: CredentialResponse) => {
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

  const formConfig = signInFormFields.fields as Array<
    Omit<Fields, "name"> & { name: Path<StudentSignInFormValues> }
  >;

  return (
    <div className="flex min-h-screen bg-blue-500 md:animate-slideInRight">
      {/* Left Slider (Hidden on mobile) */}
      <LeftSection />
      {/* Right Form */}
      <div className="flex w-full md:w-1/2 items-center flex-col bg-sky-900 md:bg-white md:justify-center  p-8">
        <div className="md:hidden flex justify-center mb-8">
          <Image
            src="/interview_excel.png"
            alt="Signup Illustration"
            width={200}
            height={200}
            className="right-10 justify-center mt-10"
          ></Image>
        </div>
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl shadow-gray-900 md:shadow-sky-600 p-8 animate-fadeInUp">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">
            Student Sign In
          </h1>

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
                  Sign In
                </button>
              </form>
            </div>
          </FormProvider>

          <div className="mt-6 text-center">
            <p className="mb-3 text-gray-600">Or</p>
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
