"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  agencyInfoSchema,
  contactInfoSchema,
  socialLinksSchema,
  brandColorsSchema,
  type AgencyInfoInput,
  type ContactInfoInput,
  type SocialLinksInput,
  type BrandColorsInput,
} from "@/lib/validations/agency";

type ActionResult =
  | { success: true }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

export async function updateAgencyInfo(
  input: AgencyInfoInput
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.agencyId) {
    return { success: false, error: "Not authenticated" };
  }

  const parsed = agencyInfoSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  await db.agency.update({
    where: { id: session.user.agencyId },
    data: {
      name: parsed.data.name,
      aboutText: parsed.data.aboutText || null,
      footerText: parsed.data.footerText || null,
    },
  });

  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function updateContactInfo(
  input: ContactInfoInput
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.agencyId) {
    return { success: false, error: "Not authenticated" };
  }

  const parsed = contactInfoSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  // Strip empty strings to null-like values in the JSON
  const contactInfo = Object.fromEntries(
    Object.entries(parsed.data).filter(([, v]) => v)
  );

  await db.agency.update({
    where: { id: session.user.agencyId },
    data: { contactInfo },
  });

  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function updateSocialLinks(
  input: SocialLinksInput
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.agencyId) {
    return { success: false, error: "Not authenticated" };
  }

  const parsed = socialLinksSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const socialLinks = Object.fromEntries(
    Object.entries(parsed.data).filter(([, v]) => v)
  );

  await db.agency.update({
    where: { id: session.user.agencyId },
    data: { socialLinks },
  });

  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function updateBrandColors(
  input: BrandColorsInput
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.agencyId) {
    return { success: false, error: "Not authenticated" };
  }

  const parsed = brandColorsSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const brandColors = Object.fromEntries(
    Object.entries(parsed.data).filter(([, v]) => v)
  );

  await db.agency.update({
    where: { id: session.user.agencyId },
    data: { brandColors },
  });

  revalidatePath("/dashboard/settings");
  return { success: true };
}
