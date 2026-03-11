"use server";

import { revalidatePath } from "next/cache";
import { del } from "@vercel/blob";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { bannerSchema, type BannerInput } from "@/lib/validations/banner";

type ActionResult =
  | { success: true; bannerId: string }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

export async function createBanner(
  input: BannerInput
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.agencyId) {
    return { success: false, error: "Not authenticated" };
  }

  const parsed = bannerSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { startDate, endDate, ...rest } = parsed.data;

  if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: { endDate: ["End date must be after start date"] },
    };
  }

  const banner = await db.banner.create({
    data: {
      ...rest,
      subtitle: rest.subtitle || null,
      ctaText: rest.ctaText || null,
      ctaLink: rest.ctaLink || null,
      backgroundImage: rest.backgroundImage || null,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      agencyId: session.user.agencyId,
    },
  });

  revalidatePath("/dashboard/banners");
  return { success: true, bannerId: banner.id };
}

export async function updateBanner(
  bannerId: string,
  input: BannerInput
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.agencyId) {
    return { success: false, error: "Not authenticated" };
  }

  const existing = await db.banner.findUnique({ where: { id: bannerId } });
  if (!existing || existing.agencyId !== session.user.agencyId) {
    return { success: false, error: "Banner not found" };
  }

  const parsed = bannerSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  // Clean up old background image blob if changed
  if (
    existing.backgroundImage &&
    parsed.data.backgroundImage !== existing.backgroundImage
  ) {
    try {
      await del(existing.backgroundImage);
    } catch {
      // Blob may already be deleted
    }
  }

  const { startDate, endDate, ...rest } = parsed.data;

  if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: { endDate: ["End date must be after start date"] },
    };
  }

  await db.banner.update({
    where: { id: bannerId },
    data: {
      ...rest,
      subtitle: rest.subtitle || null,
      ctaText: rest.ctaText || null,
      ctaLink: rest.ctaLink || null,
      backgroundImage: rest.backgroundImage || null,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
    },
  });

  revalidatePath("/dashboard/banners");
  revalidatePath(`/dashboard/banners/${bannerId}/edit`);
  return { success: true, bannerId };
}

export async function deleteBanner(
  bannerId: string
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.agencyId) {
    return { success: false, error: "Not authenticated" };
  }

  const banner = await db.banner.findUnique({ where: { id: bannerId } });
  if (!banner || banner.agencyId !== session.user.agencyId) {
    return { success: false, error: "Banner not found" };
  }

  if (banner.backgroundImage) {
    try {
      await del(banner.backgroundImage);
    } catch {
      // Blob may already be deleted
    }
  }

  await db.banner.delete({ where: { id: bannerId } });

  revalidatePath("/dashboard/banners");
  return { success: true, bannerId };
}
