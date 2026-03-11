"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  customPageSchema,
  type CustomPageInput,
} from "@/lib/validations/custom-page";

type ActionResult =
  | { success: true; pageId: string }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

export async function createCustomPage(
  input: CustomPageInput
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.agencyId) {
    return { success: false, error: "Not authenticated" };
  }

  const agencyId = session.user.agencyId;

  const parsed = customPageSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  // Check slug uniqueness within agency
  const existing = await db.customPage.findUnique({
    where: { agencyId_slug: { agencyId, slug: parsed.data.slug } },
  });
  if (existing) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: { slug: ["This slug is already in use"] },
    };
  }

  const page = await db.customPage.create({
    data: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      body: parsed.data.body || null,
      status: parsed.data.status,
      seoMeta: parsed.data.seoMeta ?? {},
      agencyId,
    },
  });

  revalidatePath("/dashboard/pages");
  return { success: true, pageId: page.id };
}

export async function updateCustomPage(
  pageId: string,
  input: CustomPageInput
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.agencyId) {
    return { success: false, error: "Not authenticated" };
  }

  const agencyId = session.user.agencyId;

  const existingPage = await db.customPage.findUnique({
    where: { id: pageId },
  });
  if (!existingPage || existingPage.agencyId !== agencyId) {
    return { success: false, error: "Page not found" };
  }

  const parsed = customPageSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  // Check slug uniqueness (excluding self)
  const slugConflict = await db.customPage.findFirst({
    where: {
      agencyId,
      slug: parsed.data.slug,
      id: { not: pageId },
    },
  });
  if (slugConflict) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: { slug: ["This slug is already in use"] },
    };
  }

  await db.customPage.update({
    where: { id: pageId },
    data: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      body: parsed.data.body || null,
      status: parsed.data.status,
      seoMeta: parsed.data.seoMeta ?? {},
    },
  });

  revalidatePath("/dashboard/pages");
  revalidatePath(`/dashboard/pages/${pageId}/edit`);
  return { success: true, pageId };
}

export async function deleteCustomPage(
  pageId: string
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.agencyId) {
    return { success: false, error: "Not authenticated" };
  }

  const page = await db.customPage.findUnique({ where: { id: pageId } });
  if (!page || page.agencyId !== session.user.agencyId) {
    return { success: false, error: "Page not found" };
  }

  await db.customPage.delete({ where: { id: pageId } });

  revalidatePath("/dashboard/pages");
  return { success: true, pageId };
}
