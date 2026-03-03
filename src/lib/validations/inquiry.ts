import { z } from "zod";

export const inquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  country: z.string().optional(),
  travelDates: z.string().optional(),
  groupSize: z.number().int().positive().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
  trekId: z.string().optional(),
});

export type InquiryInput = z.infer<typeof inquirySchema>;
