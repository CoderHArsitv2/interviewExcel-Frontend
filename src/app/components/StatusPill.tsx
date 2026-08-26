"use client";

import { CheckCircle, XCircle, Clock, LucideIcon } from "lucide-react";

type Tone = "emerald" | "rose" | "blue" | "green" | "red" | "amber" | "gray";

interface StatusConfig {
  label: string;
  tone: Tone;
  icon?: LucideIcon;
  /** Show an animated "live" dot (used for active/upcoming statuses). */
  pulse?: boolean;
}

// Keys are normalized to lowercase before lookup, so the map is case-insensitive
// and works with both slot statuses (available/booked) and session statuses.
const STATUS_MAP: Record<string, StatusConfig> = {
  available: { label: "Available", tone: "emerald" },
  booked: { label: "Booked", tone: "rose" },
  upcoming: { label: "Upcoming", tone: "blue", pulse: true },
  scheduled: { label: "Scheduled", tone: "blue", pulse: true },
  completed: { label: "Completed", tone: "green", icon: CheckCircle },
  cancelled: { label: "Cancelled", tone: "red", icon: XCircle },
  canceled: { label: "Cancelled", tone: "red", icon: XCircle },
  verified: { label: "Verified", tone: "green", icon: CheckCircle },
  pending: { label: "Pending", tone: "amber", icon: Clock },
};

const TONE_CLASSES: Record<Tone, string> = {
  emerald: "bg-emerald-100 text-emerald-700",
  rose: "bg-rose-100 text-rose-700",
  blue: "bg-blue-100 text-blue-700",
  green: "bg-green-100 text-green-700",
  red: "bg-red-100 text-red-700",
  amber: "bg-amber-100 text-amber-700",
  gray: "bg-gray-100 text-gray-700",
};

const DOT_CLASSES: Record<Tone, string> = {
  emerald: "bg-emerald-500",
  rose: "bg-rose-500",
  blue: "bg-blue-500",
  green: "bg-green-500",
  red: "bg-red-500",
  amber: "bg-amber-500",
  gray: "bg-gray-500",
};

const capitalize = (s: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";

interface StatusPillProps {
  /** Raw status from the API (any casing). */
  status: string;
  /** Override the displayed label. */
  label?: string;
  size?: "sm" | "md";
  className?: string;
}

export default function StatusPill({
  status,
  label,
  size = "md",
  className = "",
}: StatusPillProps) {
  const key = status?.toLowerCase?.() ?? "";
  const config = STATUS_MAP[key] ?? { label: capitalize(status), tone: "gray" };
  const Icon = config.icon;
  const displayLabel = label ?? config.label;

  const sizeClasses =
    size === "sm" ? "text-xs px-2.5 py-0.5 gap-1" : "text-xs px-3 py-1 gap-1.5";

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold whitespace-nowrap ${TONE_CLASSES[config.tone]} ${sizeClasses} ${className}`}
    >
      {config.pulse && (
        <span className="relative flex h-2 w-2">
          <span
            className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${DOT_CLASSES[config.tone]}`}
          />
          <span
            className={`relative inline-flex h-2 w-2 rounded-full ${DOT_CLASSES[config.tone]}`}
          />
        </span>
      )}
      {Icon && <Icon className="h-3.5 w-3.5" />}
      {displayLabel}
    </span>
  );
}
