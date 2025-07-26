"use client";

import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { setToken } from "@/providers/authProvider"; // adjust path
import { post } from "@/providers/api"; // your API helper
import { useAuth } from "@/hooks/useAuth";

interface GoogleJWT {
  email: string;
  name: string;
  picture: string;
  sub: string;
}

export default function GoogleSigninPage() {
  const router = useRouter();

  const handleSuccess = async (response: CredentialResponse) => {
    if (response.credential) {
      try {
        // decode Google JWT if needed
        const googleUser: GoogleJWT = jwtDecode(response.credential);

        // send to your backend for auth
        const res: any = await post("/student/auth/google-login", {
          token: response.credential,
          user: "student",
        });

        setToken(res.access_token);

        router.push("/student/dashboard"); // change as needed
      } catch (err) {
        console.error("Login failed", err);
      }
    }
  };

  return (
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "100px" }}
    >
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => console.error("Google Sign-In failed")}
      />
    </div>
  );
}
