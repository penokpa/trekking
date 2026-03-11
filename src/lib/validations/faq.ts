import { z } from "zod";

export const faqSchema = z.object({
  question: z.string().min(3, "Question must be at least 3 characters"),
  answer: z.string().min(3, "Answer must be at least 3 characters"),
  category: z.string().optional(),
  displayOrder: z.number().int().min(0),
});

export type FaqInput = z.infer<typeof faqSchema>;
