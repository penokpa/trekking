"use server";

import { revalidatePath } from "next/cache";
import { del } from "@vercel/blob";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  testimonialSchema,
  type TestimonialInput,
} from "@/lib/validations/testimonial";

type ActionResult =
  | { success: true; testimonialId: string }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

export async function createTestimonial(
  input: TestimonialInput
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.agencyId) {
    return { success: false, error: "Not authenticated" };
  }

  const parsed = testimonialSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { date, ...rest } = parsed.data;

  const testimonial = await db.testimonial.create({
    data: {
      ...rest,
      country: rest.country || null,
      trekId: rest.trekId || null,
      rating: rest.rating ?? null,
      reviewText: rest.reviewText || null,
      photo: rest.photo || null,
      date: date ? new Date(date) : new Date(),
      agencyId: session.user.agencyId,
    },
  });

  revalidatePath("/dashboard/testimonials");
  revalidatePath("/testimonials");
  return { success: true, testimonialId: testimonial.id };
}

export async function updateTestimonial(
  testimonialId: string,
  input: TestimonialInput
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.agencyId) {
    return { success: false, error: "Not authenticated" };
  }

  const existing = await db.testimonial.findUnique({
    where: { id: testimonialId },
  });
  if (!existing || existing.agencyId !== session.user.agencyId) {
    return { success: false, error: "Testimonial not found" };
  }

  const parsed = testimonialSchema.safeParse(input);
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

  const { date, ...rest } = parsed.data;

  await db.testimonial.update({
    where: { id: testimonialId },
    data: {
      ...rest,
      country: rest.country || null,
      trekId: rest.trekId || null,
      rating: rest.rating ?? null,
      reviewText: rest.reviewText || null,
      photo: rest.photo || null,
      date: date ? new Date(date) : undefined,
    },
  });

  revalidatePath("/dashboard/testimonials");
  revalidatePath(`/dashboard/testimonials/${testimonialId}/edit`);
  revalidatePath("/testimonials");
  return { success: true, testimonialId };
}

export async function deleteTestimonial(
  testimonialId: string
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.agencyId) {
    return { success: false, error: "Not authenticated" };
  }

  const testimonial = await db.testimonial.findUnique({
    where: { id: testimonialId },
  });
  if (!testimonial || testimonial.agencyId !== session.user.agencyId) {
    return { success: false, error: "Testimonial not found" };
  }

  if (testimonial.photo) {
    try {
      await del(testimonial.photo);
    } catch {
      // Blob may already be deleted
    }
  }

  await db.testimonial.delete({ where: { id: testimonialId } });

  revalidatePath("/dashboard/testimonials");
  revalidatePath("/testimonials");
  return { success: true, testimonialId };
}
