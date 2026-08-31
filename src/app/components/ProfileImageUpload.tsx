"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, CheckCircle2, Loader2, Upload, X } from "lucide-react";
import toast from "react-hot-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { uploadFile, UploadImageResponse } from "@/providers/api";
import { cn } from "@/lib/utils";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

interface ProfileImageUploadProps {
  uploadUrl: string;
  currentImageUrl?: string;
  fallbackImageUrl?: string;
  fallbackName?: string;
  fieldName?: string;
  role?: string;
  /**
   * "inline" renders just the avatar + camera affordance, meant to sit inside an
   * existing profile card. "card" wraps that in its own titled card.
   */
  variant?: "inline" | "card";
  /** Shows the green verified tick on the avatar (inline variant). */
  verified?: boolean;
  onUploaded?: (result: UploadImageResponse) => void | Promise<void>;
  onImageError?: () => void;
}

export default function ProfileImageUpload({
  uploadUrl,
  currentImageUrl,
  fallbackImageUrl,
  fallbackName = "User",
  fieldName = "file",
  role = "expert",
  variant = "card",
  verified = false,
  onUploaded,
  onImageError,
}: ProfileImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const erroredUrlRef = useRef<string | null>(null);

  const isExpert = role === "expert";
  const isInline = variant === "inline";

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    setUploadedUrl(null);
  }, [currentImageUrl]);

  const acceptFile = (file: File | undefined | null) => {
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Please select a JPG, PNG, WebP, or GIF image.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image must be smaller than 5 MB.");
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    acceptFile(file);
  };

  const clearSelection = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    try {
      setIsUploading(true);
      const data = await uploadFile<UploadImageResponse>(
        uploadUrl,
        selectedFile,
        fieldName
      );

      if (!data?.file_key) {
        toast.error("Upload succeeded but no file key was returned.");
        return;
      }

      await onUploaded?.(data);

      if (data.file_url) {
        erroredUrlRef.current = null;
        setUploadedUrl(data.file_url);
      }
      clearSelection();
      toast.success("Profile photo updated!");
    } catch (err) {
      console.warn("Image upload failed:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const displayUrl =
    previewUrl || uploadedUrl || currentImageUrl || fallbackImageUrl;

  const handleLoadingStatusChange = (
    status: "idle" | "loading" | "loaded" | "error"
  ) => {
    if (status !== "error" || !displayUrl) return;
    if (erroredUrlRef.current === displayUrl) return;
    erroredUrlRef.current = displayUrl;
    onImageError?.();
  };

  const accent = isExpert
    ? {
        ring: "ring-amber-400/50 dark:ring-amber-500/40",
        border: "border-amber-400/80 dark:border-amber-500/60",
        shadow: "shadow-amber-500/20",
        button: "bg-amber-500 hover:bg-amber-600 text-slate-950",
        fallback:
          "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
      }
    : {
        ring: "ring-purple-400/50 dark:ring-purple-500/40",
        border: "border-purple-400/80 dark:border-purple-500/60",
        shadow: "shadow-purple-500/20",
        button: "bg-purple-600 hover:bg-purple-700 text-white",
        fallback:
          "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300",
      };

  const control = (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="relative group">
        <Avatar
          className={cn(
            "border-4 border-white dark:border-slate-800 shadow-xl ring-4 transition-all",
            accent.ring,
            accent.shadow,
            isInline ? "h-32 w-32 sm:h-36 sm:w-36" : "h-28 w-28",
            previewUrl && "ring-emerald-400/60"
          )}
        >
          <AvatarImage
            src={displayUrl}
            alt={fallbackName}
            className="object-cover"
            onLoadingStatusChange={handleLoadingStatusChange}
          />
          <AvatarFallback
            className={cn("text-2xl font-extrabold", accent.fallback)}
          >
            {fallbackName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {/* Verified tick sits opposite the camera so the two never collide */}
        {isInline && verified && !selectedFile && (
          <span className="absolute bottom-1 left-1 bg-emerald-500 text-white p-1.5 rounded-full ring-4 ring-white dark:ring-slate-900 shadow">
            <CheckCircle2 className="h-4 w-4" />
          </span>
        )}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          title="Change profile photo"
          className={cn(
            "absolute bottom-1 right-1 p-2 rounded-full shadow-lg border-2 border-white dark:border-slate-900 transition-all hover:scale-110 active:scale-95 disabled:opacity-60 disabled:hover:scale-100",
            accent.button
          )}
          aria-label="Choose profile photo"
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Camera className="h-4 w-4" />
          )}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        onChange={handleFileSelect}
        className="hidden"
      />

      {selectedFile ? (
        <div className="w-full rounded-2xl border border-slate-200/80 dark:border-white/10 bg-slate-50/80 dark:bg-slate-800/50 p-2.5">
          <p className="truncate text-center text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-2">
            {selectedFile.name}
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={handleUpload}
              disabled={isUploading}
              className={cn(
                "flex-1 h-9 rounded-xl text-xs font-bold",
                accent.button
              )}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-3.5 w-3.5 mr-1" />
                  Save Photo
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={clearSelection}
              disabled={isUploading}
              title="Discard"
              className="h-9 rounded-xl text-xs border-slate-300 dark:border-slate-700"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      ) : (
        !isInline && (
          <Button
            type="button"
            variant="outline"
            onClick={() => inputRef.current?.click()}
            className="w-full rounded-2xl text-xs font-semibold border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <Camera className="h-3.5 w-3.5 mr-1.5" />
            Upload New Picture
          </Button>
        )
      )}
    </div>
  );

  if (isInline) return control;

  return (
    <Card className="profile-card p-6 border-slate-200/80 dark:border-white/10">
      <CardHeader className="p-0 mb-4 text-center">
        <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
          Update Photo
        </CardTitle>
        <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
          JPG, PNG or WebP. Max 5 MB.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0 flex flex-col items-center gap-4">
        {control}
      </CardContent>
    </Card>
  );
}
