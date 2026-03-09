import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { BlogPostForm } from "@/components/forms/blog-post-form";
import type { BlogPostInput } from "@/lib/validations/blog";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const agencyId = session!.user.agencyId!;

  const post = await db.blogPost.findUnique({
    where: { id },
  });

  if (!post || post.agencyId !== agencyId) {
    notFound();
  }

  const categories = await db.blogCategory.findMany({
    where: { agencyId },
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true },
  });

  const initialData: BlogPostInput & { id: string } = {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt ?? "",
    body: post.body ?? "",
    featuredImage: post.featuredImage ?? "",
    category: post.category ?? "",
    tags: (post.tags as string[]) ?? [],
    status: post.status as BlogPostInput["status"],
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Blog Post</h1>
        <p className="mt-2 text-muted-foreground">
          Update &quot;{post.title}&quot;
        </p>
      </div>
      <BlogPostForm
        mode="edit"
        initialData={initialData}
        categories={categories}
      />
    </div>
  );
}
