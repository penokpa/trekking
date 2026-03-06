"use server";

import { revalidatePath } from "next/cache";
import { del } from "@vercel/blob";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  trekSchema,
  galleryImageSchema,
  type TrekInput,
  type GalleryImageInput,
} from "@/lib/validations/trek";
import { z } from "zod";

type ActionResult =
  | { success: true; trekId: string }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

export async function createTrek(input: {
  trek: TrekInput;
  galleryImages: GalleryImageInput[];
}): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.agencyId) {
    return { success: false, error: "Not authenticated" };
  }

  const agencyId = session.user.agencyId;

  const parsed = trekSchema.safeParse(input.trek);
  if (!parsed.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const imagesParsed = z.array(galleryImageSchema).safeParse(input.galleryImages);
  if (!imagesParsed.success) {
    return { success: false, error: "Invalid gallery images" };
  }

  // Check slug uniqueness within agency
  const existing = await db.trek.findUnique({
    where: { agencyId_slug: { agencyId, slug: parsed.data.slug } },
  });
  if (existing) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: { slug: ["This slug is already in use"] },
    };
  }

  const { itinerary, includes, excludes, ...rest } = parsed.data;

  const trek = await db.trek.create({
    data: {
      ...rest,
      agencyId,
      itinerary: itinerary ?? [],
      includes: includes ?? [],
      excludes: excludes ?? [],
      images: {
        create: imagesParsed.data.map((img) => ({
          imageUrl: img.imageUrl,
          caption: img.caption || null,
          displayOrder: img.displayOrder,
        })),
      },
    },
  });

  revalidatePath("/dashboard/treks");
  return { success: true, trekId: trek.id };
}

export async function updateTrek(
  trekId: string,
  input: {
    trek: TrekInput;
    galleryImages: GalleryImageInput[];
  }
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.agencyId) {
    return { success: false, error: "Not authenticated" };
  }

  const agencyId = session.user.agencyId;

  // Verify ownership
  const existingTrek = await db.trek.findUnique({
    where: { id: trekId },
    include: { images: true },
  });

  if (!existingTrek || existingTrek.agencyId !== agencyId) {
    return { success: false, error: "Trek not found" };
  }

  const parsed = trekSchema.safeParse(input.trek);
  if (!parsed.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const imagesParsed = z.array(galleryImageSchema).safeParse(input.galleryImages);
  if (!imagesParsed.success) {
    return { success: false, error: "Invalid gallery images" };
  }

  // Check slug uniqueness (excluding self)
  const slugConflict = await db.trek.findFirst({
    where: {
      agencyId,
      slug: parsed.data.slug,
      id: { not: trekId },
    },
  });
  if (slugConflict) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: { slug: ["This slug is already in use"] },
    };
  }

  // Detect removed gallery images and clean up blobs
  const newImageUrls = new Set(imagesParsed.data.map((img) => img.imageUrl));
  const removedImages = existingTrek.images.filter(
    (img) => !newImageUrls.has(img.imageUrl)
  );

  // Clean up old cover image blob if changed
  if (
    existingTrek.coverImage &&
    parsed.data.coverImage !== existingTrek.coverImage
  ) {
    try {
      await del(existingTrek.coverImage);
    } catch {
      // Blob may already be deleted
    }
  }

  // Clean up removed gallery image blobs
  for (const img of removedImages) {
    try {
      await del(img.imageUrl);
    } catch {
      // Blob may already be deleted
    }
  }

  const { itinerary, includes, excludes, ...rest } = parsed.data;

  // Transaction: update trek + replace gallery images
  await db.$transaction([
    db.trekImage.deleteMany({ where: { trekId } }),
    db.trek.update({
      where: { id: trekId },
      data: {
        ...rest,
        itinerary: itinerary ?? [],
        includes: includes ?? [],
        excludes: excludes ?? [],
        images: {
          create: imagesParsed.data.map((img) => ({
            imageUrl: img.imageUrl,
            caption: img.caption || null,
            displayOrder: img.displayOrder,
          })),
        },
      },
    }),
  ]);

  revalidatePath("/dashboard/treks");
  revalidatePath(`/dashboard/treks/${trekId}/edit`);
  return { success: true, trekId };
}

export async function deleteTrek(trekId: string): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.agencyId) {
    return { success: false, error: "Not authenticated" };
  }

  const agencyId = session.user.agencyId;

  const trek = await db.trek.findUnique({
    where: { id: trekId },
    include: { images: true },
  });

  if (!trek || trek.agencyId !== agencyId) {
    return { success: false, error: "Trek not found" };
  }

  // Delete all blobs (cover + gallery)
  const blobUrls: string[] = [];
  if (trek.coverImage) blobUrls.push(trek.coverImage);
  for (const img of trek.images) {
    blobUrls.push(img.imageUrl);
  }

  for (const url of blobUrls) {
    try {
      await del(url);
    } catch {
      // Blob may already be deleted
    }
  }

  // Cascade handles TrekImage rows
  await db.trek.delete({ where: { id: trekId } });

  revalidatePath("/dashboard/treks");
  return { success: true, trekId };
}
