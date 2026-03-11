"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  customPageSchema,
  type CustomPageInput,
} from "@/lib/validations/custom-page";
import {
  createCustomPage,
  updateCustomPage,
} from "@/lib/actions/custom-page";
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
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface CustomPageFormProps {
  mode: "create" | "edit";
  initialData?: CustomPageInput & { id: string };
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

export function CustomPageForm({ mode, initialData }: CustomPageFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(
    mode === "edit"
  );

  const form = useForm<CustomPageInput>({
    resolver: zodResolver(customPageSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      slug: initialData?.slug ?? "",
      body: initialData?.body ?? "",
      status: initialData?.status ?? "DRAFT",
      seoMeta: {
        metaTitle: initialData?.seoMeta?.metaTitle ?? "",
        metaDescription: initialData?.seoMeta?.metaDescription ?? "",
        ogImage: initialData?.seoMeta?.ogImage ?? "",
      },
    },
  });

  // Auto-generate slug from title in create mode
  const title = form.watch("title");
  useEffect(() => {
    if (mode === "create" && !slugManuallyEdited && title) {
      form.setValue("slug", slugify(title), { shouldValidate: false });
    }
  }, [title, mode, slugManuallyEdited, form]);

  function onSubmit(data: CustomPageInput) {
    startTransition(async () => {
      const result =
        mode === "create"
          ? await createCustomPage(data)
          : await updateCustomPage(initialData!.id, data);

      if (!result.success) {
        if (result.fieldErrors) {
          for (const [field, errors] of Object.entries(result.fieldErrors)) {
            form.setError(field as keyof CustomPageInput, {
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
          ? "Page created successfully"
          : "Page updated successfully"
      );
      router.push("/dashboard/pages");
      router.refresh();
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
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
                    <Input placeholder="e.g., About Us" {...field} />
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
                      placeholder="e.g., about-us"
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
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Body</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your page content here..."
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

          {/* ---- SEO Tab ---- */}
          <TabsContent value="seo" className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="seoMeta.metaTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="SEO title (defaults to page title)"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Appears in search engine results and browser tabs
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="seoMeta.metaDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A brief description for search engines..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Recommended 150-160 characters
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="seoMeta.ogImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Open Graph Image URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/image.jpg"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Image shown when shared on social media
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>

        <div className="flex items-center gap-3 border-t pt-4">
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "create" ? "Create Page" : "Save Changes"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/pages")}
            disabled={isPending}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
