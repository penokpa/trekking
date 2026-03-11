"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface InquiryFiltersProps {
  counts: {
    ALL: number;
    NEW: number;
    READ: number;
    REPLIED: number;
    ARCHIVED: number;
  };
}

const filters = [
  { value: "ALL", label: "All" },
  { value: "NEW", label: "New" },
  { value: "READ", label: "Read" },
  { value: "REPLIED", label: "Replied" },
  { value: "ARCHIVED", label: "Archived" },
] as const;

export function InquiryFilters({ counts }: InquiryFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get("status") ?? "ALL";

  function handleFilter(status: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (status === "ALL") {
      params.delete("status");
    } else {
      params.set("status", status);
    }
    router.push(`/dashboard/inquiries?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <Button
          key={filter.value}
          variant={currentStatus === filter.value ? "default" : "outline"}
          size="sm"
          onClick={() => handleFilter(filter.value)}
        >
          {filter.label}
          <Badge
            variant="secondary"
            className="ml-1.5 px-1.5 py-0 text-xs"
          >
            {counts[filter.value]}
          </Badge>
        </Button>
      ))}
    </div>
  );
}
