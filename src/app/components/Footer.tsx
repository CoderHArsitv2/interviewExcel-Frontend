"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-purple-100/60 dark:border-white/10 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="relative w-8 h-8 rounded-xl overflow-hidden shadow-sm bg-gradient-to-br from-purple-100 to-sky-100 dark:from-slate-800 dark:to-purple-950 flex items-center justify-center">
                <Image
                  src="/mascot.png"
                  alt="Interview Excel Mascot"
                  fill
                  className="object-cover p-1"
                />
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                Interview<span className="text-gradient">Excel</span>
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              The premier platform for 1-on-1 mock interviews, personalized feedback, and career mentorship with top industry leaders.
            </p>
          </div>

          {/* Col 2: Platform */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link href="#features" className="hover:text-purple-600 dark:hover:text-purple-300 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#testimonials" className="hover:text-purple-600 dark:hover:text-purple-300 transition-colors">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link href="/student/auth" className="hover:text-purple-600 dark:hover:text-purple-300 transition-colors">
                  Find a Mentor
                </Link>
              </li>
              <li>
                <Link href="/expert/auth" className="hover:text-purple-600 dark:hover:text-purple-300 transition-colors">
                  Become a Mentor
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Resources */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Resources
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link href="#blog" className="hover:text-purple-600 dark:hover:text-purple-300 transition-colors">
                  Interview Playbooks
                </Link>
              </li>
              <li>
                <Link href="#faq" className="hover:text-purple-600 dark:hover:text-purple-300 transition-colors">
                  FAQ & Help
                </Link>
              </li>
              <li>
                <Link href="/student/auth" className="hover:text-purple-600 dark:hover:text-purple-300 transition-colors">
                  System Design Guide
                </Link>
              </li>
              <li>
                <Link href="/student/auth" className="hover:text-purple-600 dark:hover:text-purple-300 transition-colors">
                  Behavioral Prep
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Legal & Privacy
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link href="#" className="hover:text-purple-600 dark:hover:text-purple-300 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-purple-600 dark:hover:text-purple-300 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-purple-600 dark:hover:text-purple-300 transition-colors">
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-purple-100/60 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} InterviewExcel Inc. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for ambitious candidates</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
