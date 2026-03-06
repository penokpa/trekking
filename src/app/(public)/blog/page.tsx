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
    <div>
      {/* Gradient banner header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 py-16 md:py-20">
        <div className="pattern-dots absolute inset-0" />
        <div className="relative mx-auto max-w-6xl px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white">Blog</h1>
          <p className="mx-auto mt-3 max-w-xl text-indigo-100/80">
            Tips, guides, and stories from the trails to help you prepare for your
            next adventure.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        {posts.length === 0 ? (
          <div className="mt-16 text-center">
            <FileText className="mx-auto size-12 text-muted-foreground/40" />
            <p className="mt-4 text-muted-foreground">
              No blog posts yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Card
                key={post.id}
                className="group overflow-hidden border-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Gradient accent strip */}
                <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
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
                  <CardTitle className="text-lg transition-colors group-hover:text-primary">
                    {post.title}
                  </CardTitle>
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
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="w-full transition-colors group-hover:bg-muted"
                  >
                    <Link href={`/blog/${post.slug}`}>
                      Read More
                      <ArrowRight className="ml-1 size-3 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
