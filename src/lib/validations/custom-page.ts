import { z } from "zod";

export const seoMetaSchema = z.object({
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  ogImage: z.string().optional(),
});

export const customPageSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    ),
  body: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  seoMeta: seoMetaSchema.optional(),
});

export type CustomPageInput = z.infer<typeof customPageSchema>;
