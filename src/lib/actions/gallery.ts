"use server";

import { revalidatePath } from "next/cache";
import { del } from "@vercel/blob";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const addImageSchema = z.object({
  imageUrl: z.string().url(),
  caption: z.string().optional(),
  album: z.string().optional(),
});

type ActionResult =
  | { success: true }
  | { success: false; error: string };

export async function addGalleryImage(input: {
  imageUrl: string;
  caption?: string;
  album?: string;
}): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.agencyId) {
    return { success: false, error: "Not authenticated" };
  }

  const parsed = addImageSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid input" };
  }

  const maxOrder = await db.galleryImage.findFirst({
    where: { agencyId: session.user.agencyId },
    orderBy: { displayOrder: "desc" },
    select: { displayOrder: true },
  });

  await db.galleryImage.create({
    data: {
      agencyId: session.user.agencyId,
      imageUrl: parsed.data.imageUrl,
      caption: parsed.data.caption || null,
      album: parsed.data.album || null,
      displayOrder: (maxOrder?.displayOrder ?? 0) + 1,
    },
  });

  revalidatePath("/dashboard/gallery");
  revalidatePath("/gallery");
  return { success: true };
}

export async function deleteGalleryImage(imageId: string): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.agencyId) {
    return { success: false, error: "Not authenticated" };
  }

  const image = await db.galleryImage.findUnique({
    where: { id: imageId },
  });

  if (!image || image.agencyId !== session.user.agencyId) {
    return { success: false, error: "Image not found" };
  }

  // Delete blob if it's a Vercel Blob URL
  if (image.imageUrl.includes("blob.vercel-storage.com")) {
    try {
      await del(image.imageUrl);
    } catch {
      // Blob may already be deleted
    }
  }

  await db.galleryImage.delete({ where: { id: imageId } });

  revalidatePath("/dashboard/gallery");
  revalidatePath("/gallery");
  return { success: true };
}
