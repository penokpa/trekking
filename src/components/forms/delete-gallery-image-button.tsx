"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteGalleryImage } from "@/lib/actions/gallery";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";

interface DeleteGalleryImageButtonProps {
  imageId: string;
}

export function DeleteGalleryImageButton({ imageId }: DeleteGalleryImageButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteGalleryImage(imageId);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Image deleted");
      router.refresh();
    });
  }

  return (
    <Button
      variant="destructive"
      size="icon"
      className="absolute top-2 right-2 h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
      onClick={handleDelete}
      disabled={isPending}
    >
      {isPending ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : (
        <Trash2 className="h-3 w-3" />
      )}
    </Button>
  );
}
