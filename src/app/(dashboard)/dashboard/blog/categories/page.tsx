import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { BlogCategoriesManager } from "@/components/forms/blog-categories-manager";

export default async function BlogCategoriesPage() {
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
        <h1 className="text-3xl font-bold">Blog Categories</h1>
        <p className="mt-2 text-muted-foreground">
          Manage blog post categories.
        </p>
      </div>
      <BlogCategoriesManager initialCategories={categories} />
    </div>
  );
}
