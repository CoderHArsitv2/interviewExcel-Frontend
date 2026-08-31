"use client";

import PortalLayout from "@/app/components/PortalLayout";

const HEADINGS: Record<string, string> = {
  "/student/home": "Home",
  "/student/profile": "Profile",
  "/student/sessions": "Sessions",
  "/student/help": "Help",
};

export default function StudentProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PortalLayout role="student" headings={HEADINGS} fallbackHeading="Student Portal">
      {children}
    </PortalLayout>
  );
}
