import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "@/providers/authProvider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/components/app-sidebar";

export default function StudentProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <AuthProvider userRole="student">
        {/* `defaultOpen` means sidebar starts expanded */}
        <SidebarProvider defaultOpen>
          <div className="flex h-screen">
            <AppSidebar />
            <main className="flex-1 p-4">
              {/* Place trigger in top-left */}
              <SidebarTrigger className="mb-4" />
              {children}
            </main>
          </div>
        </SidebarProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
