import Link from "next/link";
import { db } from "@/lib/db";
import { getAgencyFromHeaders } from "@/lib/tenant";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, ArrowRight, Calendar } from "lucide-react";

export default async function PublicBlogPage() {
  const agency = await getAgencyFromHeaders();
  if (!agency) return null;

  const posts = await db.blogPost.findMany({
    where: {
      agencyId: agency.id,
      status: "PUBLISHED",
    },
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: { name: true },
      },
    },
  });

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Tips, guides, and stories from the trails to help you prepare for your
          next adventure.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="mt-16 text-center">
          <FileText className="mx-auto size-12 text-muted-foreground/40" />
          <p className="mt-4 text-muted-foreground">
            No blog posts yet. Check back soon!
          </p>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-center gap-2">
                  {post.category && (
                    <Badge variant="secondary">{post.category}</Badge>
                  )}
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="size-3" />
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <CardTitle className="text-lg">{post.title}</CardTitle>
                {post.excerpt && (
                  <CardDescription className="line-clamp-3">
                    {post.excerpt}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                {post.author?.name && (
                  <p className="text-xs text-muted-foreground">
                    By {post.author.name}
                  </p>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link href={`/blog/${post.slug}`}>
                    Read More
                    <ArrowRight className="ml-1 size-3" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
