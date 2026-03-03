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

export const agencySettingsSchema = z.object({
  name: z.string().min(2).optional(),
  logo: z.string().optional(),
  favicon: z.string().optional(),
  brandColors: z
    .object({
      primary: z.string().optional(),
      secondary: z.string().optional(),
      accent: z.string().optional(),
    })
    .optional(),
  contactInfo: z
    .object({
      email: z.string().email().optional(),
      phone: z.string().optional(),
      address: z.string().optional(),
    })
    .optional(),
  socialLinks: z
    .object({
      facebook: z.string().url().optional().or(z.literal("")),
      instagram: z.string().url().optional().or(z.literal("")),
      twitter: z.string().url().optional().or(z.literal("")),
      youtube: z.string().url().optional().or(z.literal("")),
    })
    .optional(),
  aboutText: z.string().optional(),
  footerText: z.string().optional(),
});

export type AgencyInput = z.infer<typeof agencySchema>;
export type AgencySettingsInput = z.infer<typeof agencySettingsSchema>;
