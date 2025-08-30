"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <header className="w-full shadow-sm bg-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-blue-600">
          InterviewExcel
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex gap-6 text-gray-700">
          <Link href="#features">Features</Link>
          <Link href="#about">About</Link>
          <Link href="#contact">Contact</Link>
        </nav>

        {/* Auth Buttons */}
        <div className="flex gap-2">
          <Link href="/student/auth">
            <Button variant="outline">Student Login</Button>
          </Link>
          <Link href="/expert/auth">
            <Button>Expert Login</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
