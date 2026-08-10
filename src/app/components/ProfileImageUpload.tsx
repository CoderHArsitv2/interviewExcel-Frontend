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
import { uploadFile } from "@/providers/api";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

interface ProfileImageUploadProps {
  /** API endpoint the image is POSTed to (multipart/form-data). */
  uploadUrl: string;
  /** Currently saved image URL, if any. */
  currentImageUrl?: string;
  /** Name used for the avatar fallback initials. */
  fallbackName?: string;
  /** Form field name expected by the backend. Defaults to "image". */
  fieldName?: string;
  /** Called with the API response after a successful upload. */
  onUploaded?: (data: { url?: string; message?: string }) => void;
}

export default function ProfileImageUpload({
  uploadUrl,
  currentImageUrl,
  fallbackName = "User",
  fieldName = "image",
  onUploaded,
}: ProfileImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Clean up the object URL to avoid memory leaks.
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Reset so selecting the same file again still fires onChange.
    e.target.value = "";
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Please select a JPG, PNG, or WebP image.");
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
      const data = await uploadFile<{ url?: string; message?: string }>(
        uploadUrl,
        selectedFile,
        fieldName
      );
      onUploaded?.(data);
      clearSelection();
    } catch (err) {
      // uploadFile already surfaces a toast; keep a console trail for debugging.
      console.warn("Image upload failed:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const displayUrl = previewUrl || currentImageUrl;

  return (
    <Card className="border-white/40 bg-white/60">
      <CardHeader>
        <CardTitle className="text-lg">Profile Photo</CardTitle>
        <CardDescription>JPG, PNG or WebP. Max size 5 MB.</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col items-center gap-4">
        <div className="relative">
          <Avatar className="h-32 w-32 border-4 border-white shadow-lg ring-4 ring-primary/20">
            <AvatarImage
              src={displayUrl}
              alt={fallbackName}
              className="object-cover"
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
