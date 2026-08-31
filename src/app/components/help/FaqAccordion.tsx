"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { accordionContentVariant } from "@/animations";
import { cn } from "@/lib/utils";
import type { PortalRole } from "./types";

export interface Faq {
  question: string;
  answer: string;
}

const ACCENTS = {
  expert: {
    openCard:
      "border-amber-200 dark:border-amber-800/50 ring-4 ring-amber-50/60 dark:ring-amber-950/30",
    openText: "text-amber-700 dark:text-amber-300",
    openChip:
      "bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300",
  },
  student: {
    openCard:
      "border-purple-200 dark:border-purple-800/50 ring-4 ring-purple-50/60 dark:ring-purple-950/30",
    openText: "text-purple-700 dark:text-purple-300",
    openChip:
      "bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300",
  },
} as const;

interface FaqAccordionProps {
  faqs: Faq[];
  role?: PortalRole;
  /** Index open on first render; pass null for all-collapsed. */
  defaultOpen?: number | null;
  className?: string;
}

export default function FaqAccordion({
  faqs,
  role = "student",
  defaultOpen = 0,
  className,
}: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen);
  const accent = ACCENTS[role];

  return (
    <div className={cn("space-y-3", className)}>
      {faqs.map((faq, idx) => {
        const isOpen = openIndex === idx;

        return (
          <div
            key={faq.question}
            className={cn(
              "bg-white dark:bg-slate-900/70 border rounded-2xl overflow-hidden transition-all duration-300",
              isOpen
                ? `shadow-md ${accent.openCard}`
                : "border-slate-200/80 dark:border-white/10 shadow-sm hover:border-slate-300 dark:hover:border-white/20 hover:shadow-md"
            )}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              aria-expanded={isOpen}
              className="w-full text-left px-5 sm:px-6 py-4 sm:py-5 flex justify-between items-center gap-4 bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-slate-400/40"
            >
              <span
                className={cn(
                  "font-semibold text-base sm:text-lg transition-colors",
                  isOpen
                    ? accent.openText
                    : "text-slate-800 dark:text-slate-100"
                )}
              >
                {faq.question}
              </span>
              <span
                className={cn(
                  "shrink-0 p-1 rounded-full transition-colors",
                  isOpen
                    ? accent.openChip
                    : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500"
                )}
              >
                {isOpen ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  variants={accordionContentVariant}
                  initial="collapsed"
                  animate="expanded"
                  exit="collapsed"
                  className="overflow-hidden"
                >
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-white/5">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
