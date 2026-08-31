"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "@/providers/authProvider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/components/app-sidebar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";

interface PortalLayoutProps {
  role: "student" | "expert";
  /** pathname → page heading rendered in the sticky header. */
  headings: Record<string, string>;
  /** Heading used when the pathname isn't in the map. */
  fallbackHeading: string;
  children: React.ReactNode;
}

/**
 * Single chrome for both protected portals.
 *
 * The shell owns the only scroll container: the root is a fixed-height flex row
 * (`h-svh overflow-hidden`) so the document itself never scrolls, and `<main>`
 * scrolls on its own. The column beside the sidebar takes `w-full min-w-0` —
 * SidebarProvider's wrapper is a flex row, so without it the column shrink-to-fits
 * and leaves dead space on the right.
 */
export default function PortalLayout({
  role,
  headings,
  fallbackHeading,
  children,
}: PortalLayoutProps) {
  const pathname = usePathname();

  const pageHeading = useMemo(
    () => headings[pathname] || fallbackHeading,
    [pathname, headings, fallbackHeading]
  );

  const isExpert = role === "expert";

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <AuthProvider userRole={role}>
        <SidebarProvider defaultOpen>
          <div
            className={cn(
              "flex h-svh w-full overflow-hidden bg-slate-50 dark:bg-slate-950 text-foreground transition-colors duration-300",
              // Role theme scope — drives --primary/--secondary for the subtree
              role
            )}
          >
            <AppSidebar />

            {/* Content column — min-w-0 keeps wide children from blowing out the row */}
            <div className="flex w-full min-w-0 flex-col">
              <header className="shrink-0 z-20 flex items-center justify-between gap-4 border-b border-slate-200/70 dark:border-white/10 bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl px-4 sm:px-6 lg:px-8 py-3.5">
                <div className="flex min-w-0 items-center gap-3">
                  <SidebarTrigger className="shrink-0 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5" />
                  <h1 className="truncate text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    {pageHeading}
                  </h1>
                  <span
                    className={cn(
                      "hidden sm:inline-flex shrink-0 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                      isExpert
                        ? "bg-amber-100/80 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/40"
                        : "bg-purple-100/80 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-200/80 dark:border-purple-800/40"
                    )}
                  >
                    {isExpert ? "Expert" : "Student"}
                  </span>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <ThemeToggle />
                </div>
              </header>

              {/* The one scroll container in the shell */}
              <main className="flex-1 overflow-y-auto overscroll-contain">
                <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
