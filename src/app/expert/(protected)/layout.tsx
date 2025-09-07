"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "@/providers/authProvider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/components/app-sidebar";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export default function ExpertProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Map pathname → heading
  const pageHeading = useMemo(() => {
    const mapping: Record<string, string> = {
      "/expert/profile": "Profile",
      "/expert/sessions": "Sessions",
      "/expert/help": "Help",
      "/expert/home": "Home",
    };

    return mapping[pathname] || "Expert Portal";
  }, [pathname]);

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <AuthProvider userRole="expert">
        <SidebarProvider defaultOpen>
          <div className="flex h-screen">
            <AppSidebar />
            <main className="flex-1 p-4">
              <div className="flex items-center  gap-4 mb-2">
                <SidebarTrigger className="mb-4" />
                <h1 className="text-3xl font-bold mb-6 text-theme border-b-4  border-expert inline-block pb-2 tracking-wide">
                  {pageHeading}
                </h1>
              </div>
              {children}
            </main>
          </div>
        </SidebarProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
