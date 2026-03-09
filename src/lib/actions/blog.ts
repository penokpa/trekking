"use server";

import { revalidatePath } from "next/cache";
import { del } from "@vercel/blob";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  blogPostSchema,
  blogCategorySchema,
  type BlogPostInput,
  type BlogCategoryInput,
} from "@/lib/validations/blog";

type ActionResult =
  | { success: true; postId: string }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

type CategoryActionResult =
  | { success: true; categoryId: string }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

export async function createBlogPost(
  input: BlogPostInput
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.agencyId) {
    return { success: false, error: "Not authenticated" };
  }

  const agencyId = session.user.agencyId;

  const parsed = blogPostSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  // Check slug uniqueness within agency
  const existing = await db.blogPost.findUnique({
    where: { agencyId_slug: { agencyId, slug: parsed.data.slug } },
  });
  if (existing) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: { slug: ["This slug is already in use"] },
    };
  }

  const { tags, ...rest } = parsed.data;

  const post = await db.blogPost.create({
    data: {
      ...rest,
      agencyId,
      authorId: session.user.id!,
      tags: tags ?? [],
    },
  });

  revalidatePath("/dashboard/blog");
  revalidatePath("/blog");
  return { success: true, postId: post.id };
}

export async function updateBlogPost(
  postId: string,
  input: BlogPostInput
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.agencyId) {
    return { success: false, error: "Not authenticated" };
  }

  const agencyId = session.user.agencyId;

  // Verify ownership
  const existingPost = await db.blogPost.findUnique({
    where: { id: postId },
  });

  if (!existingPost || existingPost.agencyId !== agencyId) {
    return { success: false, error: "Post not found" };
  }

  const parsed = blogPostSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  // Check slug uniqueness (excluding self)
  const slugConflict = await db.blogPost.findFirst({
    where: {
      agencyId,
      slug: parsed.data.slug,
      id: { not: postId },
    },
  });
  if (slugConflict) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: { slug: ["This slug is already in use"] },
    };
  }

  // Clean up old featured image blob if changed
  if (
    existingPost.featuredImage &&
    parsed.data.featuredImage !== existingPost.featuredImage
  ) {
    try {
      await del(existingPost.featuredImage);
    } catch {
      // Blob may already be deleted
    }
  }

  const { tags, ...rest } = parsed.data;

  await db.blogPost.update({
    where: { id: postId },
    data: {
      ...rest,
      tags: tags ?? [],
    },
  });

  revalidatePath("/dashboard/blog");
  revalidatePath(`/dashboard/blog/${postId}/edit`);
  revalidatePath("/blog");
  return { success: true, postId };
}

export async function deleteBlogPost(postId: string): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.agencyId) {
    return { success: false, error: "Not authenticated" };
  }

  const agencyId = session.user.agencyId;

  const post = await db.blogPost.findUnique({
    where: { id: postId },
  });

  if (!post || post.agencyId !== agencyId) {
    return { success: false, error: "Post not found" };
  }

  // Delete featured image blob if exists
  if (post.featuredImage) {
    try {
      await del(post.featuredImage);
    } catch {
      // Blob may already be deleted
    }
  }

  await db.blogPost.delete({ where: { id: postId } });

  revalidatePath("/dashboard/blog");
  revalidatePath("/blog");
  return { success: true, postId };
}

export async function createBlogCategory(
  input: BlogCategoryInput
): Promise<CategoryActionResult> {
  const session = await auth();
  if (!session?.user?.agencyId) {
    return { success: false, error: "Not authenticated" };
  }

  const agencyId = session.user.agencyId;

  const parsed = blogCategorySchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  // Check slug uniqueness within agency
  const existing = await db.blogCategory.findUnique({
    where: { agencyId_slug: { agencyId, slug: parsed.data.slug } },
  });
  if (existing) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: { slug: ["This category slug is already in use"] },
    };
  }

  const category = await db.blogCategory.create({
    data: {
      ...parsed.data,
      agencyId,
    },
  });

  revalidatePath("/dashboard/blog/categories");
  return { success: true, categoryId: category.id };
}

export async function deleteBlogCategory(
  categoryId: string
): Promise<CategoryActionResult> {
  const session = await auth();
  if (!session?.user?.agencyId) {
    return { success: false, error: "Not authenticated" };
  }

  const agencyId = session.user.agencyId;

  const category = await db.blogCategory.findUnique({
    where: { id: categoryId },
  });

  if (!category || category.agencyId !== agencyId) {
    return { success: false, error: "Category not found" };
  }

  await db.blogCategory.delete({ where: { id: categoryId } });

  revalidatePath("/dashboard/blog/categories");
  return { success: true, categoryId };
}
