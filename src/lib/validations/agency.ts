import { z } from "zod";

export const agencySchema = z.object({
  name: z.string().min(2, "Agency name must be at least 2 characters"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  customDomain: z.string().url().optional().or(z.literal("")),
  logo: z.string().optional(),
  aboutText: z.string().optional(),
});

export const agencyInfoSchema = z.object({
  name: z.string().min(2, "Agency name must be at least 2 characters"),
  aboutText: z.string().optional(),
  footerText: z.string().optional(),
});

export const contactInfoSchema = z.object({
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
});

export const socialLinksSchema = z.object({
  facebook: z.string().url("Invalid URL").optional().or(z.literal("")),
  instagram: z.string().url("Invalid URL").optional().or(z.literal("")),
  twitter: z.string().url("Invalid URL").optional().or(z.literal("")),
  youtube: z.string().url("Invalid URL").optional().or(z.literal("")),
  linkedin: z.string().url("Invalid URL").optional().or(z.literal("")),
  tiktok: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export const brandColorsSchema = z.object({
  primary: z
    .string()
    .regex(/^#([0-9a-fA-F]{6})$/, "Must be a valid hex color (e.g. #1a2b3c)")
    .optional()
    .or(z.literal("")),
  secondary: z
    .string()
    .regex(/^#([0-9a-fA-F]{6})$/, "Must be a valid hex color (e.g. #1a2b3c)")
    .optional()
    .or(z.literal("")),
  accent: z
    .string()
    .regex(/^#([0-9a-fA-F]{6})$/, "Must be a valid hex color (e.g. #1a2b3c)")
    .optional()
    .or(z.literal("")),
});

export const agencySettingsSchema = z.object({
  name: z.string().min(2).optional(),
  logo: z.string().optional(),
  favicon: z.string().optional(),
  brandColors: brandColorsSchema.optional(),
  contactInfo: contactInfoSchema.optional(),
  socialLinks: socialLinksSchema.optional(),
  aboutText: z.string().optional(),
  footerText: z.string().optional(),
});

export type AgencyInput = z.infer<typeof agencySchema>;
export type AgencySettingsInput = z.infer<typeof agencySettingsSchema>;
export type AgencyInfoInput = z.infer<typeof agencyInfoSchema>;
export type ContactInfoInput = z.infer<typeof contactInfoSchema>;
export type SocialLinksInput = z.infer<typeof socialLinksSchema>;
export type BrandColorsInput = z.infer<typeof brandColorsSchema>;
