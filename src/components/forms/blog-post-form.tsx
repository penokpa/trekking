"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { blogPostSchema, type BlogPostInput } from "@/lib/validations/blog";
import { createBlogPost, updateBlogPost } from "@/lib/actions/blog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUpload } from "@/components/forms/image-upload";
import { StringListEditor } from "@/components/forms/string-list-editor";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface BlogPostFormProps {
  mode: "create" | "edit";
  initialData?: BlogPostInput & { id: string };
  categories: { id: string; name: string; slug: string }[];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function BlogPostForm({
  mode,
  initialData,
  categories,
}: BlogPostFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(
    mode === "edit"
  );

  const form = useForm<BlogPostInput>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      slug: initialData?.slug ?? "",
      excerpt: initialData?.excerpt ?? "",
      body: initialData?.body ?? "",
      featuredImage: initialData?.featuredImage ?? "",
      category: initialData?.category ?? "",
      tags: initialData?.tags ?? [],
      status: initialData?.status ?? "DRAFT",
    },
  });

  // Auto-generate slug from title in create mode
  const title = form.watch("title");
  useEffect(() => {
    if (mode === "create" && !slugManuallyEdited && title) {
      form.setValue("slug", slugify(title), { shouldValidate: false });
    }
  }, [title, mode, slugManuallyEdited, form]);

  function onSubmit(data: BlogPostInput) {
    startTransition(async () => {
      const result =
        mode === "create"
          ? await createBlogPost(data)
          : await updateBlogPost(initialData!.id, data);

      if (!result.success) {
        if (result.fieldErrors) {
          for (const [field, errors] of Object.entries(result.fieldErrors)) {
            form.setError(field as keyof BlogPostInput, {
              message: errors[0],
            });
          }
        }
        toast.error(
          result.error === "Validation failed"
            ? "Please fix the errors below"
            : result.error
        );
        return;
      }

      toast.success(
        mode === "create"
          ? "Blog post created successfully"
          : "Blog post updated successfully"
      );
      router.push("/dashboard/blog");
      router.refresh();
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="media">Media & Meta</TabsTrigger>
          </TabsList>

          {/* ---- Content Tab ---- */}
          <TabsContent value="content" className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="My Blog Post Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="my-blog-post-title"
                      {...field}
                      onChange={(e) => {
                        setSlugManuallyEdited(true);
                        field.onChange(e);
                      }}
                    />
                  </FormControl>
                  <FormDescription>URL-friendly identifier</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Excerpt</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A brief summary of the post..."
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Body</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your blog post content here..."
                      rows={12}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Plain text. Line breaks will be preserved.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? "DRAFT"}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="PUBLISHED">Published</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          {/* ---- Media & Meta Tab ---- */}
          <TabsContent value="media" className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="featuredImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Featured Image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value || null}
                      onChange={(url) => field.onChange(url ?? "")}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <>
                      <Input
                        placeholder="Select or type a category..."
                        list="blog-categories"
                        {...field}
                        value={field.value ?? ""}
                      />
                      <datalist id="blog-categories">
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.name} />
                        ))}
                      </datalist>
                    </>
                  </FormControl>
                  <FormDescription>
                    Pick from existing categories or type a new one
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <StringListEditor
                      value={(field.value as string[]) ?? []}
                      onChange={field.onChange}
                      placeholder="e.g., trekking, nepal, adventure..."
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>

        <div className="flex items-center gap-3 border-t pt-4">
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "create" ? "Create Post" : "Save Changes"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/blog")}
            disabled={isPending}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
