"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-24 bg-blue-600 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
          Ready to Excel in Your Interview?
        </h2>
        <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
          Join thousands of students who have cracked their dream jobs with InterviewExcel. Start your journey today.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/student/auth/signin">
            <Button size="lg" className="h-14 px-8 text-lg bg-white text-blue-600 hover:bg-gray-100 rounded-full shadow-xl">
              Get Started Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Link href="/expert/auth/signin">
            <Button variant="outline" size="lg" className="h-14 px-8 text-lg border-white text-white hover:bg-blue-700 hover:text-white rounded-full bg-transparent">
              Become a Mentor
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
