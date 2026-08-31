"use client";

import PortalLayout from "@/app/components/PortalLayout";

const HEADINGS: Record<string, string> = {
  "/expert/home": "Dashboard",
  "/expert/profile": "Profile",
  "/expert/sessions": "Sessions",
  "/expert/help": "Help",
};

export default function ExpertProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PortalLayout role="expert" headings={HEADINGS} fallbackHeading="Expert Portal">
      {children}
    </PortalLayout>
  );
}
