"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteTestimonial } from "@/lib/actions/testimonial";
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

interface DeleteTestimonialDialogProps {
  testimonialId: string;
  clientName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteTestimonialDialog({
  testimonialId,
  clientName,
  open,
  onOpenChange,
}: DeleteTestimonialDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteTestimonial(testimonialId);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Testimonial deleted successfully");
      onOpenChange(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Testimonial</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the testimonial from &quot;
            {clientName}&quot;? This action cannot be undone.
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
