import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BlogActions } from "@/components/forms/blog-actions";
import { Plus, Tags } from "lucide-react";

export default async function DashboardBlogPage() {
  const session = await auth();
  const agencyId = session!.user.agencyId!;

  const posts = await db.blogPost.findMany({
    where: { agencyId },
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Blog Posts</h1>
          <p className="mt-2 text-muted-foreground">Manage blog posts.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/blog/categories">
              <Tags className="h-4 w-4" />
              Categories
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/blog/new">
              <Plus className="h-4 w-4" />
              New Post
            </Link>
          </Button>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">No blog posts yet. Write your first post to get started.</p>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-16" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>{post.category ?? "---"}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={
                        post.status === "PUBLISHED"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {post.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{post.author?.name ?? "---"}</TableCell>
                  <TableCell>{post.createdAt.toLocaleDateString()}</TableCell>
                  <TableCell>
                    <BlogActions postId={post.id} postTitle={post.title} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
