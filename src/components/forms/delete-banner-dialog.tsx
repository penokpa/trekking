"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteBanner } from "@/lib/actions/banner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface DeleteBannerDialogProps {
  bannerId: string;
  bannerTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteBannerDialog({
  bannerId,
  bannerTitle,
  open,
  onOpenChange,
}: DeleteBannerDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteBanner(bannerId);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Banner deleted successfully");
      onOpenChange(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Banner</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &quot;{bannerTitle}&quot;? This
            action cannot be undone. The background image will also be
            permanently deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
