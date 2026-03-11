"use server";

import { revalidatePath } from "next/cache";
import { del } from "@vercel/blob";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { teamMemberSchema, type TeamMemberInput } from "@/lib/validations/team";

type ActionResult =
  | { success: true; memberId: string }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

export async function createTeamMember(
  input: TeamMemberInput
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.agencyId) {
    return { success: false, error: "Not authenticated" };
  }

  const parsed = teamMemberSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const maxOrder = await db.teamMember.findFirst({
    where: { agencyId: session.user.agencyId },
    orderBy: { displayOrder: "desc" },
    select: { displayOrder: true },
  });

  const member = await db.teamMember.create({
    data: {
      ...parsed.data,
      title: parsed.data.title || null,
      bio: parsed.data.bio || null,
      photo: parsed.data.photo || null,
      displayOrder: parsed.data.displayOrder || (maxOrder?.displayOrder ?? 0) + 1,
      agencyId: session.user.agencyId,
    },
  });

  revalidatePath("/dashboard/team");
  return { success: true, memberId: member.id };
}

export async function updateTeamMember(
  memberId: string,
  input: TeamMemberInput
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.agencyId) {
    return { success: false, error: "Not authenticated" };
  }

  const existing = await db.teamMember.findUnique({ where: { id: memberId } });
  if (!existing || existing.agencyId !== session.user.agencyId) {
    return { success: false, error: "Team member not found" };
  }

  const parsed = teamMemberSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  // Clean up old photo blob if changed
  if (existing.photo && parsed.data.photo !== existing.photo) {
    try {
      await del(existing.photo);
    } catch {
      // Blob may already be deleted
    }
  }

  await db.teamMember.update({
    where: { id: memberId },
    data: {
      ...parsed.data,
      title: parsed.data.title || null,
      bio: parsed.data.bio || null,
      photo: parsed.data.photo || null,
    },
  });

  revalidatePath("/dashboard/team");
  return { success: true, memberId };
}

export async function deleteTeamMember(
  memberId: string
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.agencyId) {
    return { success: false, error: "Not authenticated" };
  }

  const member = await db.teamMember.findUnique({ where: { id: memberId } });
  if (!member || member.agencyId !== session.user.agencyId) {
    return { success: false, error: "Team member not found" };
  }

  if (member.photo) {
    try {
      await del(member.photo);
    } catch {
      // Blob may already be deleted
    }
  }

  await db.teamMember.delete({ where: { id: memberId } });

  revalidatePath("/dashboard/team");
  return { success: true, memberId };
}
