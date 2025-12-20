"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

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
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
            I
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">
            Interview<span className="text-blue-600">Excel</span>
          </span>
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
          <Link href="#features" className="hover:text-blue-600 transition-colors">Features</Link>
          <Link href="#testimonials" className="hover:text-blue-600 transition-colors">Testimonials</Link>
          <Link href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</Link>
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
