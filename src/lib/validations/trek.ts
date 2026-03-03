import { z } from "zod";

export const itineraryDaySchema = z.object({
  day: z.number().int().positive(),
  title: z.string().min(1, "Day title is required"),
  description: z.string().optional(),
  altitude: z.number().optional(),
  distance: z.string().optional(),
  accommodation: z.string().optional(),
  meals: z.string().optional(),
});

export const trekSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  summary: z.string().optional(),
  description: z.string().optional(),
  duration: z.number().int().positive().optional(),
  difficulty: z.enum(["EASY", "MODERATE", "CHALLENGING", "STRENUOUS"]).optional(),
  maxAltitude: z.number().int().positive().optional(),
  groupSize: z.number().int().positive().optional(),
  priceFrom: z.number().positive().optional(),
  itinerary: z.array(itineraryDaySchema).optional(),
  includes: z.array(z.string()).optional(),
  excludes: z.array(z.string()).optional(),
  coverImage: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
  featured: z.boolean().optional(),
  region: z.string().optional(),
  bestSeason: z.string().optional(),
});

export type TrekInput = z.infer<typeof trekSchema>;
export type ItineraryDayInput = z.infer<typeof itineraryDaySchema>;
