import { z } from "zod";

export const bannerSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  subtitle: z.string().optional(),
  ctaText: z.string().optional(),
  ctaLink: z.string().optional(),
  backgroundImage: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  location: z.enum(["HOME", "TREK_LISTING"]),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

export type BannerInput = z.infer<typeof bannerSchema>;
