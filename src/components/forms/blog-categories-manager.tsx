"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  createBlogCategory,
  deleteBlogCategory,
} from "@/lib/actions/blog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface BlogCategoriesManagerProps {
  initialCategories: Category[];
}

export function BlogCategoriesManager({
  initialCategories,
}: BlogCategoriesManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  // Auto-generate slug from name
  useEffect(() => {
    if (!slugManuallyEdited && name) {
      setSlug(slugify(name));
    }
  }, [name, slugManuallyEdited]);

  function handleCreate() {
    if (!name.trim() || !slug.trim()) return;

    startTransition(async () => {
      const result = await createBlogCategory({
        name: name.trim(),
        slug: slug.trim(),
      });
      if (!result.success) {
        toast.error(result.fieldErrors?.slug?.[0] ?? result.error);
        return;
      }
      toast.success("Category created");
      setCategories((prev) => [
        ...prev,
        { id: result.categoryId, name: name.trim(), slug: slug.trim() },
      ]);
      setName("");
      setSlug("");
      setSlugManuallyEdited(false);
      router.refresh();
    });
  }

  function handleDelete(categoryId: string) {
    startTransition(async () => {
      const result = await deleteBlogCategory(categoryId);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Category deleted");
      setCategories((prev) => prev.filter((c) => c.id !== categoryId));
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      {/* Add category form */}
      <div className="flex items-end gap-3">
        <div className="flex-1 space-y-1">
          <label className="text-sm font-medium">Name</label>
          <Input
            placeholder="e.g., Travel Tips"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isPending}
          />
        </div>
        <div className="flex-1 space-y-1">
          <label className="text-sm font-medium">Slug</label>
          <Input
            placeholder="e.g., travel-tips"
            value={slug}
            onChange={(e) => {
              setSlugManuallyEdited(true);
              setSlug(e.target.value);
            }}
            disabled={isPending}
          />
        </div>
        <Button
          onClick={handleCreate}
          disabled={isPending || !name.trim() || !slug.trim()}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          Add
        </Button>
      </div>

      {/* Categories table */}
      {categories.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">
            No categories yet. Add your first category above.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead className="w-16" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell className="font-medium">{cat.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {cat.slug}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleDelete(cat.id)}
                      disabled={isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
