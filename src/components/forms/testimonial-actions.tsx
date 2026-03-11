"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteTestimonialDialog } from "@/components/forms/delete-testimonial-dialog";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

interface TestimonialActionsProps {
  testimonialId: string;
  clientName: string;
}

export function TestimonialActions({
  testimonialId,
  clientName,
}: TestimonialActionsProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);

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
            <Link href={`/dashboard/testimonials/${testimonialId}/edit`}>
              <Pencil className="h-4 w-4" />
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onSelect={() => setDeleteOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteTestimonialDialog
        testimonialId={testimonialId}
        clientName={clientName}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
}
