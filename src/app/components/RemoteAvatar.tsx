"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

/**
 * Avatar for profile pictures that come back from the API as **presigned R2
 * URLs**.
 *
 * Deliberately not `next/image`: the R2 host carries an account hash (so it
 * differs per environment) and every response is a freshly signed URL that
 * expires in 24h — the optimizer would miss its cache on every render and
 * `next/image` throws outright on an unconfigured host. A plain <img> behind
 * Radix Avatar also gives us an initials fallback the moment a link expires.
 */
export interface RemoteAvatarProps {
  /** Presigned URL from the API. */
  src?: string | null;
  /** Tried when `src` is missing or fails — e.g. the Google `picture` field. */
  fallbackSrc?: string | null;
  /** Drives the initials shown when no image loads. */
  name?: string;
  role?: "student" | "expert";
  /** Sizing / radius utilities, e.g. "w-24 h-24 rounded-2xl". */
  className?: string;
  /** Fires once per broken URL — use it to re-fetch a fresh presigned link. */
  onImageError?: () => void;
}

const FALLBACK_ACCENTS = {
  student:
    "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300",
  expert: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
} as const;

const initialsOf = (name?: string) =>
  (name || "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "?";

export default function RemoteAvatar({
  src,
  fallbackSrc,
  name,
  role = "student",
  className,
  onImageError,
}: RemoteAvatarProps) {
  // Try the presigned URL first, then the fallback, then initials.
  const candidates = [src, fallbackSrc].filter(Boolean) as string[];
  const [attempt, setAttempt] = useState(0);

  // Reset when the parent hands us a fresh URL.
  useEffect(() => {
    setAttempt(0);
  }, [src, fallbackSrc]);

  const current = candidates[attempt];

  const handleStatus = (status: "idle" | "loading" | "loaded" | "error") => {
    if (status !== "error" || !current) return;
    if (attempt < candidates.length - 1) {
      setAttempt((i) => i + 1);
      return;
    }
    onImageError?.();
  };

  return (
    <Avatar className={cn("size-10", className)}>
      {current && (
        <AvatarImage
          key={current}
          src={current}
          alt={name || "Profile picture"}
          className="object-cover"
          onLoadingStatusChange={handleStatus}
        />
      )}
      <AvatarFallback
        className={cn(
          "font-extrabold rounded-[inherit]",
          FALLBACK_ACCENTS[role]
        )}
      >
        {initialsOf(name)}
      </AvatarFallback>
    </Avatar>
  );
}
