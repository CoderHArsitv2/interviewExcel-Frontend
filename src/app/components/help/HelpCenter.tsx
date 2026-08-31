"use client";

import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, FileText, MessageCircle, Sparkles } from "lucide-react";
import { staggerContainer, cardFadeUpVariant } from "@/animations";
import { cn } from "@/lib/utils";
import FaqAccordion, { type Faq } from "./FaqAccordion";
import type { PortalRole } from "./types";

export interface HelpAction {
  label: string;
  icon?: React.ReactNode;
  /** Renders an anchor when set, otherwise an inert button. */
  href?: string;
  variant?: "solid" | "ghost";
}

export interface HelpResource {
  label: string;
  href: string;
}

const ACCENTS = {
  expert: {
    eyebrow: "text-amber-600 dark:text-amber-400",
    banner:
      "from-amber-400 via-amber-500 to-orange-500 dark:from-amber-600 dark:via-amber-700 dark:to-orange-700 shadow-amber-500/25 dark:shadow-amber-950/40",
    bannerText: "text-slate-950 dark:text-white",
    solidBtn: "bg-white hover:bg-amber-50 text-amber-700",
    resourceIcon: "text-amber-500",
    resourceHover: "hover:text-amber-600 dark:hover:text-amber-300",
  },
  student: {
    eyebrow: "text-purple-600 dark:text-purple-400",
    banner:
      "from-violet-500 via-purple-600 to-indigo-600 dark:from-violet-700 dark:via-purple-800 dark:to-indigo-800 shadow-purple-500/25 dark:shadow-purple-950/40",
    bannerText: "text-white",
    solidBtn: "bg-white hover:bg-purple-50 text-purple-700",
    resourceIcon: "text-purple-500",
    resourceHover: "hover:text-purple-600 dark:hover:text-purple-300",
  },
} as const;

export interface HelpCenterProps {
  role: PortalRole;
  /** Small uppercase label above the intro. */
  eyebrow?: string;
  description: string;
  faqs: Faq[];
  contact: {
    title: string;
    description: string;
    actions: HelpAction[];
  };
  resources: HelpResource[];
  resourcesTitle?: string;
}

/**
 * Shared help layout for both portals: FAQ accordion on the left, contact
 * banner and resource links on the right. Copy and accent come from props so
 * the student and expert pages stay in sync structurally.
 */
export default function HelpCenter({
  role,
  eyebrow,
  description,
  faqs,
  contact,
  resources,
  resourcesTitle = "Quick Resources",
}: HelpCenterProps) {
  const accent = ACCENTS[role];

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6 lg:space-y-8"
    >
      {/* Intro */}
      <motion.div variants={cardFadeUpVariant}>
        {eyebrow && (
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className={cn("w-4 h-4", accent.eyebrow)} />
            <span
              className={cn(
                "text-xs font-bold uppercase tracking-widest",
                accent.eyebrow
              )}
            >
              {eyebrow}
            </span>
          </div>
        )}
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
          {description}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
        {/* FAQs */}
        <motion.section
          variants={cardFadeUpVariant}
          className="lg:col-span-2 space-y-4"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <FaqAccordion faqs={faqs} role={role} />
        </motion.section>

        {/* Sidebar */}
        <div className="space-y-6 lg:sticky lg:top-4">
          {/* Contact banner */}
          <motion.div
            variants={cardFadeUpVariant}
            className={cn(
              "relative overflow-hidden rounded-3xl bg-gradient-to-br p-6 sm:p-7 shadow-xl",
              accent.banner,
              accent.bannerText
            )}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/15 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/15 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/25 rounded-2xl flex items-center justify-center mb-5 ring-2 ring-white/30 backdrop-blur-md">
                <MessageCircle className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-bold mb-1.5 tracking-tight">
                {contact.title}
              </h3>
              <p className="text-sm opacity-80 mb-6 leading-relaxed">
                {contact.description}
              </p>

              <div className="space-y-2.5">
                {contact.actions.map((action) => {
                  const className = cn(
                    "w-full h-11 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all",
                    action.variant === "ghost"
                      ? "bg-white/15 hover:bg-white/25 border border-white/30"
                      : cn(accent.solidBtn, "shadow-lg hover:scale-[1.02]")
                  );

                  return action.href ? (
                    <a
                      key={action.label}
                      href={action.href}
                      className={className}
                    >
                      {action.icon}
                      {action.label}
                    </a>
                  ) : (
                    <button
                      key={action.label}
                      type="button"
                      className={className}
                    >
                      {action.icon}
                      {action.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Resource links */}
          <motion.div
            variants={cardFadeUpVariant}
            className="profile-card p-6 sm:p-7"
          >
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <FileText className={cn("w-5 h-5", accent.resourceIcon)} />
              {resourcesTitle}
            </h3>

            <ul className="divide-y divide-slate-100 dark:divide-white/5">
              {resources.map((resource) => (
                <li key={resource.label}>
                  <a
                    href={resource.href}
                    className={cn(
                      "flex items-center justify-between gap-3 py-3 text-sm font-medium text-slate-600 dark:text-slate-300 transition-colors group",
                      accent.resourceHover
                    )}
                  >
                    <span>{resource.label}</span>
                    <ExternalLink className="w-4 h-4 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
