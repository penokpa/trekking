"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { faqSchema, type FaqInput } from "@/lib/validations/faq";

type ActionResult =
  | { success: true; faqId: string }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

export async function createFaq(input: FaqInput): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.agencyId) {
    return { success: false, error: "Not authenticated" };
  }

  const parsed = faqSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const maxOrder = await db.fAQ.findFirst({
    where: { agencyId: session.user.agencyId },
    orderBy: { displayOrder: "desc" },
    select: { displayOrder: true },
  });

  const faq = await db.fAQ.create({
    data: {
      ...parsed.data,
      category: parsed.data.category || null,
      displayOrder: parsed.data.displayOrder || (maxOrder?.displayOrder ?? 0) + 1,
      agencyId: session.user.agencyId,
    },
  });

  revalidatePath("/dashboard/faqs");
  return { success: true, faqId: faq.id };
}

export async function updateFaq(
  faqId: string,
  input: FaqInput
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.agencyId) {
    return { success: false, error: "Not authenticated" };
  }

  const existing = await db.fAQ.findUnique({ where: { id: faqId } });
  if (!existing || existing.agencyId !== session.user.agencyId) {
    return { success: false, error: "FAQ not found" };
  }

  const parsed = faqSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  await db.fAQ.update({
    where: { id: faqId },
    data: {
      ...parsed.data,
      category: parsed.data.category || null,
    },
  });

  revalidatePath("/dashboard/faqs");
  return { success: true, faqId };
}

export async function deleteFaq(faqId: string): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.agencyId) {
    return { success: false, error: "Not authenticated" };
  }

  const faq = await db.fAQ.findUnique({ where: { id: faqId } });
  if (!faq || faq.agencyId !== session.user.agencyId) {
    return { success: false, error: "FAQ not found" };
  }

  await db.fAQ.delete({ where: { id: faqId } });

  revalidatePath("/dashboard/faqs");
  return { success: true, faqId };
}
