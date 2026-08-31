"use client";

import { Mail } from "lucide-react";
import { HelpCenter, type Faq, type HelpResource } from "@/app/components/help";

const faqs: Faq[] = [
  {
    question: "How do I create available slots for students?",
    answer:
      "Navigate to the 'Sessions' page and click 'Generate Slots'. You can select the days, start/end times, and duration for each slot. Once generated, these slots will be visible to students for booking.",
  },
  {
    question: "How do I get paid for my sessions?",
    answer:
      "Payments are processed automatically after a session is completed. The session fee (minus any platform charges) is credited to your registered bank account within 3–5 business days. You can view your earnings on the Home dashboard.",
  },
  {
    question: "What if a student doesn't show up?",
    answer:
      "If a student misses a scheduled session, you can mark it as a no-show. You will still receive the session fee. If this happens repeatedly with a student, please report it to our support team.",
  },
  {
    question: "How do I update my expertise and session fees?",
    answer:
      "Go to your 'Profile' page and click the edit button. You can update your bio, expertise areas, session fee, experience, and other details. Changes are reflected instantly to students browsing experts.",
  },
  {
    question: "What does the verification badge mean?",
    answer:
      "A verified badge indicates your profile has been reviewed and approved by the InterviewExcel team. Verified experts get higher visibility and student trust. If your verification is pending, ensure your profile is complete.",
  },
  {
    question: "Can I cancel a session after a student books it?",
    answer:
      "You can cancel up to 12 hours before the scheduled time without penalty. Late cancellations may affect your rating. Navigate to 'Sessions' → 'Upcoming' to manage your bookings.",
  },
];

const resources: HelpResource[] = [
  { label: "Expert Agreement", href: "#" },
  { label: "Payout Policy", href: "#" },
  { label: "Mentoring Best Practices", href: "#" },
  { label: "Community Guidelines", href: "#" },
];

export default function ExpertHelpPage() {
  return (
    <HelpCenter
      role="expert"
      eyebrow="Expert Support"
      description="Everything you need to know about mentoring on InterviewExcel. Can't find what you're looking for? Reach out to our team."
      faqs={faqs}
      contact={{
        title: "Need more help?",
        description:
          "Our expert support team is available 24/7 to assist you with any platform issues.",
        actions: [
          { label: "Email Support", icon: <Mail className="w-4 h-4" /> },
          { label: "View Expert Guide", variant: "ghost" },
        ],
      }}
      resources={resources}
    />
  );
}
