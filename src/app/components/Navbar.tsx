"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Menu, X, Sparkles } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        scrolled
          ? "bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-purple-100/50 dark:border-white/10 py-3 shadow-sm shadow-purple-500/5"
          : "bg-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative w-10 h-10 rounded-2xl overflow-hidden shadow-md shadow-purple-500/20 ring-2 ring-purple-200/60 dark:ring-purple-500/30 bg-gradient-to-br from-purple-100 to-sky-100 dark:from-slate-800 dark:to-purple-950 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            <Image
              src="/mascot.png"
              alt="Interview Excel Mascot"
              fill
              className="object-cover p-1"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
              Interview<span className="text-gradient font-extrabold">Excel</span>
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2 px-4 py-1.5 rounded-full bg-white/70 dark:bg-slate-900/60 border border-purple-100/60 dark:border-white/10 shadow-sm backdrop-blur-md text-sm font-medium text-slate-600 dark:text-slate-300">
          <Link
            href="#features"
            className="px-4 py-1.5 rounded-full hover:text-purple-600 dark:hover:text-purple-300 hover:bg-purple-50/60 dark:hover:bg-white/5 transition-all"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="px-4 py-1.5 rounded-full hover:text-purple-600 dark:hover:text-purple-300 hover:bg-purple-50/60 dark:hover:bg-white/5 transition-all"
          >
            How It Works
          </Link>
          <Link
            href="#testimonials"
            className="px-4 py-1.5 rounded-full hover:text-purple-600 dark:hover:text-purple-300 hover:bg-purple-50/60 dark:hover:bg-white/5 transition-all"
          >
            Stories
          </Link>
          <Link
            href="#faq"
            className="px-4 py-1.5 rounded-full hover:text-purple-600 dark:hover:text-purple-300 hover:bg-purple-50/60 dark:hover:bg-white/5 transition-all"
          >
            FAQ
          </Link>
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />

          <Link href="/student/auth">
            <Button
              variant="ghost"
              className="text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-white/5 rounded-full font-medium"
            >
              Log in
            </Button>
          </Link>
          <Link href="/student/auth">
            <Button className="rounded-full px-5 py-2.5 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700 text-white font-semibold shadow-md shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all">
              <Sparkles className="w-4 h-4 mr-1.5 animate-pulse text-purple-200" />
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger & Theme Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-purple-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-purple-200/50 dark:border-white/10"
            aria-label="Open menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 mx-4 p-5 rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-purple-100 dark:border-white/10 shadow-2xl flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-2 text-slate-700 dark:text-slate-200 font-medium">
            <Link
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl hover:bg-purple-50 dark:hover:bg-slate-800 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl hover:bg-purple-50 dark:hover:bg-slate-800 transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="#testimonials"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl hover:bg-purple-50 dark:hover:bg-slate-800 transition-colors"
            >
              Stories
            </Link>
            <Link
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl hover:bg-purple-50 dark:hover:bg-slate-800 transition-colors"
            >
              FAQ
            </Link>
          </nav>
          <div className="pt-3 border-t border-purple-100 dark:border-white/10 flex flex-col gap-2">
            <Link href="/student/auth" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full rounded-2xl border-purple-200 dark:border-slate-700">
                Log in
              </Button>
            </Link>
            <Link href="/student/auth" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
