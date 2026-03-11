import { z } from "zod";

export const teamMemberSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  title: z.string().optional(),
  bio: z.string().optional(),
  photo: z.string().optional(),
  displayOrder: z.number().int().min(0),
});

export type TeamMemberInput = z.infer<typeof teamMemberSchema>;
