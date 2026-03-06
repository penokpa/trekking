"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteTrek } from "@/lib/actions/trek";
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

interface DeleteTrekDialogProps {
  trekId: string;
  trekTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteTrekDialog({
  trekId,
  trekTitle,
  open,
  onOpenChange,
}: DeleteTrekDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteTrek(trekId);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Trek deleted successfully");
      onOpenChange(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Trek</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &quot;{trekTitle}&quot;? This action
            cannot be undone. All images will also be permanently deleted.
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
