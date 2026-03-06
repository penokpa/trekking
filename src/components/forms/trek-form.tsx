"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  trekSchema,
  type TrekInput,
  type ItineraryDayInput,
} from "@/lib/validations/trek";
import type { UploadedImage } from "@/components/forms/image-upload";
import { createTrek, updateTrek } from "@/lib/actions/trek";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import { ImageUpload, MultiImageUpload } from "@/components/forms/image-upload";
import { StringListEditor } from "@/components/forms/string-list-editor";
import { ItineraryBuilder } from "@/components/forms/itinerary-builder";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface TrekFormProps {
  mode: "create" | "edit";
  initialData?: TrekInput & { id: string };
  initialImages?: UploadedImage[];
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

export function TrekForm({ mode, initialData, initialImages }: TrekFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(mode === "edit");
  const [galleryImages, setGalleryImages] = useState<UploadedImage[]>(
    initialImages ?? []
  );

  const form = useForm<TrekInput>({
    resolver: zodResolver(trekSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      slug: initialData?.slug ?? "",
      summary: initialData?.summary ?? "",
      description: initialData?.description ?? "",
      duration: initialData?.duration ?? undefined,
      difficulty: initialData?.difficulty ?? undefined,
      maxAltitude: initialData?.maxAltitude ?? undefined,
      groupSize: initialData?.groupSize ?? undefined,
      priceFrom: initialData?.priceFrom ?? undefined,
      itinerary: initialData?.itinerary ?? [],
      includes: initialData?.includes ?? [],
      excludes: initialData?.excludes ?? [],
      coverImage: initialData?.coverImage ?? "",
      status: initialData?.status ?? "DRAFT",
      featured: initialData?.featured ?? false,
      region: initialData?.region ?? "",
      bestSeason: initialData?.bestSeason ?? "",
    },
  });

  // Auto-generate slug from title in create mode
  const title = form.watch("title");
  useEffect(() => {
    if (mode === "create" && !slugManuallyEdited && title) {
      form.setValue("slug", slugify(title), { shouldValidate: false });
    }
  }, [title, mode, slugManuallyEdited, form]);

  function onSubmit(data: TrekInput) {
    startTransition(async () => {
      const result =
        mode === "create"
          ? await createTrek({ trek: data, galleryImages })
          : await updateTrek(initialData!.id, { trek: data, galleryImages });

      if (!result.success) {
        if (result.fieldErrors) {
          for (const [field, errors] of Object.entries(result.fieldErrors)) {
            form.setError(field as keyof TrekInput, {
              message: errors[0],
            });
          }
        }
        toast.error(result.error === "Validation failed" ? "Please fix the errors below" : result.error);
        return;
      }

      toast.success(
        mode === "create" ? "Trek created successfully" : "Trek updated successfully"
      );
      router.push("/dashboard/treks");
      router.refresh();
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
            <TabsTrigger value="includes">Includes / Excludes</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
          </TabsList>

          {/* ---- Basic Info Tab ---- */}
          <TabsContent value="basic" className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Everest Base Camp Trek" {...field} />
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
                      placeholder="everest-base-camp-trek"
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
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Summary</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A brief summary of the trek..."
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detailed trek description..."
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (days)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="14"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === "" ? undefined : Number(e.target.value)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="EASY">Easy</SelectItem>
                        <SelectItem value="MODERATE">Moderate</SelectItem>
                        <SelectItem value="CHALLENGING">Challenging</SelectItem>
                        <SelectItem value="STRENUOUS">Strenuous</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxAltitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Altitude (m)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="5364"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === "" ? undefined : Number(e.target.value)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="groupSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Group Size</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="12"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === "" ? undefined : Number(e.target.value)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priceFrom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price From ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="1200"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === "" ? undefined : Number(e.target.value)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Region</FormLabel>
                    <FormControl>
                      <Input placeholder="Everest Region" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="bestSeason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Best Season</FormLabel>
                    <FormControl>
                      <Input placeholder="Mar-May, Sep-Nov" {...field} />
                    </FormControl>
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

              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3 pt-8">
                    <FormControl>
                      <Switch
                        checked={field.value ?? false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="!mt-0">Featured Trek</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>

          {/* ---- Itinerary Tab ---- */}
          <TabsContent value="itinerary" className="pt-4">
            <FormField
              control={form.control}
              name="itinerary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Itinerary</FormLabel>
                  <FormControl>
                    <ItineraryBuilder
                      value={(field.value as ItineraryDayInput[]) ?? []}
                      onChange={field.onChange}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          {/* ---- Includes / Excludes Tab ---- */}
          <TabsContent value="includes" className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="includes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What&apos;s Included</FormLabel>
                  <FormControl>
                    <StringListEditor
                      value={(field.value as string[]) ?? []}
                      onChange={field.onChange}
                      placeholder="e.g., Airport pickup, Meals during trek..."
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="excludes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What&apos;s Excluded</FormLabel>
                  <FormControl>
                    <StringListEditor
                      value={(field.value as string[]) ?? []}
                      onChange={field.onChange}
                      placeholder="e.g., International flights, Travel insurance..."
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          {/* ---- Images Tab ---- */}
          <TabsContent value="images" className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="coverImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Image</FormLabel>
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

            <div className="space-y-2">
              <FormLabel>Gallery Images</FormLabel>
              <MultiImageUpload
                value={galleryImages}
                onChange={setGalleryImages}
                maxImages={20}
                disabled={isPending}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex items-center gap-3 border-t pt-4">
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "create" ? "Create Trek" : "Save Changes"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/treks")}
            disabled={isPending}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
