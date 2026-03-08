"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addGalleryImage } from "@/lib/actions/gallery";
import { ImageUpload } from "@/components/forms/image-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";

export function AddGalleryImageDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [album, setAlbum] = useState("");

  function reset() {
    setImageUrl(null);
    setCaption("");
    setAlbum("");
  }

  function handleSubmit() {
    if (!imageUrl) {
      toast.error("Please upload an image first");
      return;
    }

    startTransition(async () => {
      const result = await addGalleryImage({
        imageUrl,
        caption: caption || undefined,
        album: album || undefined,
      });

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success("Image added to gallery");
      reset();
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          Add Image
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Gallery Image</DialogTitle>
          <DialogDescription>
            Upload an image and add details.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <ImageUpload
            value={imageUrl}
            onChange={setImageUrl}
            disabled={isPending}
          />
          <div className="space-y-2">
            <Label htmlFor="caption">Caption</Label>
            <Input
              id="caption"
              placeholder="Describe this image..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              disabled={isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="album">Album</Label>
            <Input
              id="album"
              placeholder="e.g., Everest Region"
              value={album}
              onChange={(e) => setAlbum(e.target.value)}
              disabled={isPending}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isPending || !imageUrl}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add Image
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
