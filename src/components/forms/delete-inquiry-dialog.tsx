"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteInquiry } from "@/lib/actions/inquiry";
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

interface DeleteInquiryDialogProps {
  inquiryId: string;
  inquiryName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteInquiryDialog({
  inquiryId,
  inquiryName,
  open,
  onOpenChange,
}: DeleteInquiryDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteInquiry(inquiryId);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Inquiry deleted successfully");
      onOpenChange(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Inquiry</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the inquiry from &quot;
            {inquiryName}&quot;? This action cannot be undone.
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
