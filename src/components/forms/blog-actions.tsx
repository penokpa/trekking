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
import { DeleteBlogDialog } from "@/components/forms/delete-blog-dialog";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

interface BlogActionsProps {
  postId: string;
  postTitle: string;
}

export function BlogActions({ postId, postTitle }: BlogActionsProps) {
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
            <Link href={`/dashboard/blog/${postId}/edit`}>
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

      <DeleteBlogDialog
        postId={postId}
        postTitle={postTitle}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
}
