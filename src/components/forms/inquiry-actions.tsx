"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteInquiryDialog } from "@/components/forms/delete-inquiry-dialog";
import { updateInquiryStatus } from "@/lib/actions/inquiry";
import type { InquiryStatus } from "@/generated/prisma/client";
import { toast } from "sonner";
import {
  MoreHorizontal,
  Eye,
  Mail,
  MailOpen,
  Archive,
  Trash2,
} from "lucide-react";

interface InquiryActionsProps {
  inquiryId: string;
  inquiryName: string;
  currentStatus: InquiryStatus;
}

export function InquiryActions({
  inquiryId,
  inquiryName,
  currentStatus,
}: InquiryActionsProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleStatusChange(status: InquiryStatus) {
    startTransition(async () => {
      const result = await updateInquiryStatus(inquiryId, status);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success(`Inquiry marked as ${status.toLowerCase()}`);
      router.refresh();
    });
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/inquiries/${inquiryId}`}>
              <Eye className="h-4 w-4" />
              View Details
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {currentStatus !== "READ" && (
            <DropdownMenuItem
              disabled={isPending}
              onSelect={() => handleStatusChange("READ")}
            >
              <MailOpen className="h-4 w-4" />
              Mark as Read
            </DropdownMenuItem>
          )}
          {currentStatus !== "REPLIED" && (
            <DropdownMenuItem
              disabled={isPending}
              onSelect={() => handleStatusChange("REPLIED")}
            >
              <Mail className="h-4 w-4" />
              Mark as Replied
            </DropdownMenuItem>
          )}
          {currentStatus !== "ARCHIVED" && (
            <DropdownMenuItem
              disabled={isPending}
              onSelect={() => handleStatusChange("ARCHIVED")}
            >
              <Archive className="h-4 w-4" />
              Archive
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onSelect={() => setDeleteOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteInquiryDialog
        inquiryId={inquiryId}
        inquiryName={inquiryName}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
}
