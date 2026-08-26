"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Loader2, Upload, X } from "lucide-react";
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

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
// Mirrors the server-side allowlist for POST /upload/image.
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

interface ProfileImageUploadProps {
  /** API endpoint the image is POSTed to (multipart/form-data). */
  uploadUrl: string;
  /** Currently saved image URL (presigned, ephemeral), if any. */
  currentImageUrl?: string;
  /** Last-resort remote image (e.g. the Google avatar) before initials. */
  fallbackImageUrl?: string;
  /** Name used for the avatar fallback initials. */
  fallbackName?: string;
  /** Form field name expected by the backend. Defaults to "file". */
  fieldName?: string;
  /**
   * Called with the upload record after a successful upload. Persisting
   * `file_key` onto the profile is the caller's job — the spinner stays up
   * until the returned promise settles.
   */
  onUploaded?: (result: UploadImageResponse) => void | Promise<void>;
  /**
   * Called when the current image fails to load. Presigned URLs expire after
   * 24h, so a long-lived page should re-fetch the profile to get a fresh one.
   */
  onImageError?: () => void;
}

export default function ProfileImageUpload({
  uploadUrl,
  currentImageUrl,
  fallbackImageUrl,
  fallbackName = "User",
  fieldName = "file",
  onUploaded,
  onImageError,
}: ProfileImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  // Presigned URL from the upload response, shown until the parent's re-fetch
  // supplies a fresh `currentImageUrl`.
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  // Guards against an error/re-fetch loop when the image is simply broken.
  const erroredUrlRef = useRef<string | null>(null);

  // Clean up the object URL to avoid memory leaks.
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // Once the parent hands us a newer saved URL, drop the post-upload preview.
  useEffect(() => {
    setUploadedUrl(null);
  }, [currentImageUrl]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Reset so selecting the same file again still fires onChange.
    e.target.value = "";
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

      // Keep the spinner up while the caller saves the key to the profile, so
      // a failure there doesn't look like a successful change.
      await onUploaded?.(data);

      if (data.file_url) {
        erroredUrlRef.current = null;
        setUploadedUrl(data.file_url);
      }
      clearSelection();
    } catch (err) {
      // uploadFile already surfaces a toast; keep a console trail for debugging.
      console.warn("Image upload failed:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const displayUrl =
    previewUrl || uploadedUrl || currentImageUrl || fallbackImageUrl;

  const handleLoadingStatusChange = (status: "idle" | "loading" | "loaded" | "error") => {
    if (status !== "error" || !displayUrl) return;
    // A presigned URL may simply have expired (24h TTL) — ask the parent for a
    // fresh profile, but only once per URL.
    if (erroredUrlRef.current === displayUrl) return;
    erroredUrlRef.current = displayUrl;
    onImageError?.();
  };

  return (
    <Card className="border-white/40 bg-white/60">
      <CardHeader>
        <CardTitle className="text-lg">Profile Photo</CardTitle>
        <CardDescription>JPG, PNG, WebP or GIF. Max size 5 MB.</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col items-center gap-4">
        <div className="relative">
          <Avatar className="h-32 w-32 border-4 border-white shadow-lg ring-4 ring-primary/20">
            <AvatarImage
              src={displayUrl}
              alt={fallbackName}
              className="object-cover"
              onLoadingStatusChange={handleLoadingStatusChange}
            />
            <AvatarFallback className="bg-primary/10 text-3xl font-bold text-primary">
              {fallbackName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <Button
            type="button"
            size="icon"
            variant="secondary"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            className="absolute bottom-1 right-1 h-9 w-9 rounded-full shadow-md"
            aria-label="Choose profile photo"
          >
            <Camera className="h-4 w-4" />
          </Button>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          onChange={handleFileSelect}
          className="hidden"
        />

        {selectedFile ? (
          <div className="flex w-full flex-col gap-2">
            <p className="truncate text-center text-sm text-gray-600">
              {selectedFile.name}
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={handleUpload}
                disabled={isUploading}
                className="flex-1"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Upload
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={clearSelection}
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={() => inputRef.current?.click()}
            className="w-full"
          >
            <Camera className="h-4 w-4" />
            Change Photo
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
