"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteBlogPost } from "@/lib/actions/blog";
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

interface DeleteBlogDialogProps {
  postId: string;
  postTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteBlogDialog({
  postId,
  postTitle,
  open,
  onOpenChange,
}: DeleteBlogDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteBlogPost(postId);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Blog post deleted successfully");
      onOpenChange(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Blog Post</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &quot;{postTitle}&quot;? This action
            cannot be undone. The featured image will also be permanently
            deleted.
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
