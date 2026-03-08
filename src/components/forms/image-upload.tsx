"use client";

import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImagePlus, X, Upload, Loader2, GripVertical } from "lucide-react";
import { toast } from "sonner";

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB

async function uploadFile(file: File): Promise<string> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File must be under 4MB. Please resize or compress it.");
  }

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error || `Upload failed (${res.status})`);
  }

  if (!data?.url) {
    throw new Error("No URL returned from upload");
  }

  return data.url;
}

// ---------- Single Image Upload ----------

interface ImageUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
  disabled?: boolean;
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback(
    async (file: File) => {
      setUploading(true);
      try {
        const url = await uploadFile(file);
        onChange(url);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file?.type.startsWith("image/")) handleUpload(file);
    },
    [handleUpload]
  );

  if (value) {
    return (
      <div className="relative aspect-video w-full max-w-sm overflow-hidden rounded-lg border">
        <Image
          src={value}
          alt="Cover image"
          fill
          className="object-cover"
          sizes="384px"
        />
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2 h-7 w-7"
          onClick={() => onChange(null)}
          disabled={disabled}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div
      className="flex aspect-video w-full max-w-sm cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 p-6 text-center transition-colors hover:border-muted-foreground/50"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => !disabled && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
          e.target.value = "";
        }}
        disabled={disabled}
      />
      {uploading ? (
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      ) : (
        <>
          <Upload className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Drop an image here or click to upload (max 4MB)
          </p>
        </>
      )}
    </div>
  );
}

// ---------- Multi Image Upload ----------

export interface UploadedImage {
  id?: string;
  imageUrl: string;
  caption?: string;
  displayOrder: number;
}

interface MultiImageUploadProps {
  value: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  maxImages?: number;
  disabled?: boolean;
}

export function MultiImageUpload({
  value,
  onChange,
  maxImages = 20,
  disabled,
}: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleUpload = useCallback(
    async (file: File) => {
      if (value.length >= maxImages) return;
      setUploading(true);
      try {
        const url = await uploadFile(file);
        onChange([
          ...value,
          {
            imageUrl: url,
            caption: "",
            displayOrder: value.length,
          },
        ]);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [value, onChange, maxImages]
  );

  const removeImage = (index: number) => {
    const updated = value.filter((_, i) => i !== index);
    onChange(updated.map((img, i) => ({ ...img, displayOrder: i })));
  };

  const updateCaption = (index: number, caption: string) => {
    const updated = [...value];
    updated[index] = { ...updated[index], caption };
    onChange(updated);
  };

  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    const updated = [...value];
    const [dragged] = updated.splice(dragItem.current, 1);
    updated.splice(dragOverItem.current, 0, dragged);
    onChange(updated.map((img, i) => ({ ...img, displayOrder: i })));
    dragItem.current = null;
    dragOverItem.current = null;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {value.map((img, index) => (
          <div
            key={img.imageUrl}
            className="group relative rounded-lg border bg-card"
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragEnter={() => handleDragEnter(index)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => e.preventDefault()}
          >
            <div className="relative aspect-video overflow-hidden rounded-t-lg">
              <Image
                src={img.imageUrl}
                alt={img.caption || `Image ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              <div className="absolute top-1 left-1 cursor-grab opacity-0 transition-opacity group-hover:opacity-100">
                <GripVertical className="h-5 w-5 text-white drop-shadow-md" />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => removeImage(index)}
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <div className="p-2">
              <Input
                placeholder="Caption (optional)"
                value={img.caption || ""}
                onChange={(e) => updateCaption(index, e.target.value)}
                className="h-8 text-xs"
                disabled={disabled}
              />
            </div>
          </div>
        ))}

        {value.length < maxImages && (
          <div
            className="flex aspect-video cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 transition-colors hover:border-muted-foreground/50"
            onClick={() => !disabled && inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file);
                e.target.value = "";
              }}
              disabled={disabled}
            />
            {uploading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <ImagePlus className="h-6 w-6 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Add Image</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
