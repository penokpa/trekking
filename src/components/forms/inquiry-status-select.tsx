"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateInquiryStatus } from "@/lib/actions/inquiry";
import type { InquiryStatus } from "@/generated/prisma/client";
import { toast } from "sonner";

interface InquiryStatusSelectProps {
  inquiryId: string;
  currentStatus: InquiryStatus;
}

const statusOptions: { value: InquiryStatus; label: string }[] = [
  { value: "NEW", label: "New" },
  { value: "READ", label: "Read" },
  { value: "REPLIED", label: "Replied" },
  { value: "ARCHIVED", label: "Archived" },
];

export function InquiryStatusSelect({
  inquiryId,
  currentStatus,
}: InquiryStatusSelectProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleChange(value: string) {
    startTransition(async () => {
      const result = await updateInquiryStatus(
        inquiryId,
        value as InquiryStatus
      );
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success(`Status updated to ${value.toLowerCase()}`);
      router.refresh();
    });
  }

  return (
    <Select
      defaultValue={currentStatus}
      onValueChange={handleChange}
      disabled={isPending}
    >
      <SelectTrigger className="w-[140px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
