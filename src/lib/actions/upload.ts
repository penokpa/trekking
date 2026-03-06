"use server";

import { del } from "@vercel/blob";
import { auth } from "@/lib/auth";

export async function deleteBlob(url: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  try {
    await del(url);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete blob:", error);
    return { error: "Failed to delete image" };
  }
}
