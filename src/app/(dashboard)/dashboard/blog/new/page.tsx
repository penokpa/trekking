import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { BlogPostForm } from "@/components/forms/blog-post-form";

export default async function NewBlogPostPage() {
  const session = await auth();
  const agencyId = session!.user.agencyId!;

  const categories = await db.blogCategory.findMany({
    where: { agencyId },
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create Blog Post</h1>
        <p className="mt-2 text-muted-foreground">
          Write a new blog post for your site.
        </p>
      </div>
      <BlogPostForm mode="create" categories={categories} />
    </div>
  );
}
