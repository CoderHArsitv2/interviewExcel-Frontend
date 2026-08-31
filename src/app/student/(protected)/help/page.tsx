"use client";

import { Mail } from "lucide-react";
import { HelpCenter, type Faq, type HelpResource } from "@/app/components/help";

const faqs: Faq[] = [
  {
    question: "How do I book a mock interview?",
    answer:
      "You can book a session by navigating to the 'Home' tab and selecting a mentor. From their profile, choose an available time slot that works for you and confirm the booking.",
  },
  {
    question: "What happens if a mentor doesn't show up?",
    answer:
      "In the rare event a mentor misses a session, please reach out to our support team within 24 hours. We will investigate the issue and provide a full refund or a free reschedule credit.",
  },
  {
    question: "How do I prepare for my first session?",
    answer:
      "Review the mentor's profile to understand their background. Have your resume ready, prepare a brief introduction, and note down specific areas or questions you want to focus on during the mock interview.",
  },
  {
    question: "Where can I find the feedback after a session?",
    answer:
      "Once a session is marked as completed by the mentor, you can navigate to 'My Sessions', click on the 'Past Sessions' tab, and select 'View Feedback' on the relevant session card.",
  },
  {
    question: "Can I cancel or reschedule a booked session?",
    answer:
      "Yes, you can cancel or reschedule up to 24 hours before the session starts without any penalty. Late cancellations may be subject to a fee depending on the mentor's policy.",
  },
];

const resources: HelpResource[] = [
  { label: "Terms of Service", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Community Guidelines", href: "#" },
];

export default function HelpPage() {
  return (
    <HelpCenter
      role="student"
      eyebrow="Candidate Support"
      description="Find answers to common questions or reach out to our team directly. We are here to ensure you have the best experience."
      faqs={faqs}
      contact={{
        title: "Need more help?",
        description:
          "Our support team is available 24/7 to assist you with any platform issues.",
        actions: [
          { label: "Email Support", icon: <Mail className="w-4 h-4" /> },
          { label: "View Setup Guide", variant: "ghost" },
        ],
      }}
      resources={resources}
    />
  );
}
