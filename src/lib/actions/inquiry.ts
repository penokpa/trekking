"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import type { InquiryStatus } from "@/generated/prisma/client";

type ActionResult =
  | { success: true }
  | { success: false; error: string };

export async function updateInquiryStatus(
  inquiryId: string,
  status: InquiryStatus
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.agencyId) {
    return { success: false, error: "Not authenticated" };
  }

  const inquiry = await db.inquiry.findUnique({
    where: { id: inquiryId },
  });
  if (!inquiry || inquiry.agencyId !== session.user.agencyId) {
    return { success: false, error: "Inquiry not found" };
  }

  await db.inquiry.update({
    where: { id: inquiryId },
    data: { status },
  });

  revalidatePath("/dashboard/inquiries");
  revalidatePath(`/dashboard/inquiries/${inquiryId}`);
  return { success: true };
}

export async function markInquiryAsRead(
  inquiryId: string
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.agencyId) {
    return { success: false, error: "Not authenticated" };
  }

  const inquiry = await db.inquiry.findUnique({
    where: { id: inquiryId },
  });
  if (!inquiry || inquiry.agencyId !== session.user.agencyId) {
    return { success: false, error: "Inquiry not found" };
  }

  if (inquiry.status === "NEW") {
    await db.inquiry.update({
      where: { id: inquiryId },
      data: { status: "READ" },
    });
    revalidatePath("/dashboard/inquiries");
    revalidatePath(`/dashboard/inquiries/${inquiryId}`);
  }

  return { success: true };
}

export async function updateInquiryNotes(
  inquiryId: string,
  notes: string
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.agencyId) {
    return { success: false, error: "Not authenticated" };
  }

  const inquiry = await db.inquiry.findUnique({
    where: { id: inquiryId },
  });
  if (!inquiry || inquiry.agencyId !== session.user.agencyId) {
    return { success: false, error: "Inquiry not found" };
  }

  await db.inquiry.update({
    where: { id: inquiryId },
    data: { adminNotes: notes || null },
  });

  revalidatePath(`/dashboard/inquiries/${inquiryId}`);
  return { success: true };
}

export async function deleteInquiry(
  inquiryId: string
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.agencyId) {
    return { success: false, error: "Not authenticated" };
  }

  const inquiry = await db.inquiry.findUnique({
    where: { id: inquiryId },
  });
  if (!inquiry || inquiry.agencyId !== session.user.agencyId) {
    return { success: false, error: "Inquiry not found" };
  }

  await db.inquiry.delete({ where: { id: inquiryId } });

  revalidatePath("/dashboard/inquiries");
  return { success: true };
}
