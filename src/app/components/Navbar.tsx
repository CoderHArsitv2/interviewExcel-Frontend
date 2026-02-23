"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300",
        scrolled ? "glass py-3" : "bg-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-blue-500/20 ring-2 ring-blue-100 bg-white">
            <Image
              src="/mascot.png"
              alt="Interview Excel Mascot"
              fill
              className="object-cover p-1"
            />
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">
            Interview<span className="text-blue-600">Excel</span>
          </span>
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
          <Link href="#features" className="hover:text-blue-600 transition-colors">Features</Link>
          <Link href="#testimonials" className="hover:text-blue-600 transition-colors">Testimonials</Link>
          <Link href="#faq" className="hover:text-blue-600 transition-colors">FAQ</Link>
        </nav>

        {/* Auth Buttons */}
        <div className="flex gap-3">
          <Link href="/student/auth">
            <Button variant="ghost" className="hover:bg-blue-50 hover:text-blue-600">Log in</Button>
          </Link>
          <Link href="/student/auth">
            <Button className="rounded-full px-6 bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
