import { z } from "zod";

export const testimonialSchema = z.object({
  clientName: z.string().min(2, "Client name must be at least 2 characters"),
  country: z.string().optional(),
  trekId: z.string().optional(),
  rating: z.number().int().min(1).max(5).optional(),
  reviewText: z.string().optional(),
  photo: z.string().optional(),
  date: z.string().optional(),
  featured: z.boolean(),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;
