import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getAgencyFromHeaders } from "@/lib/tenant";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, User } from "lucide-react";

export default async function BlogPostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const agency = await getAgencyFromHeaders();
  if (!agency) return null;

  const post = await db.blogPost.findUnique({
    where: {
      agencyId_slug: {
        agencyId: agency.id,
        slug,
      },
    },
    include: {
      author: {
        select: { name: true },
      },
    },
  });

  if (!post || post.status !== "PUBLISHED") {
    notFound();
  }

  const tags = (post.tags as string[] | null) ?? [];

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 md:py-16">
      {/* Back link */}
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link href="/blog">
          <ArrowLeft className="mr-1 size-4" />
          Back to Blog
        </Link>
      </Button>

      {/* Header */}
      <header>
        <div className="flex flex-wrap items-center gap-3">
          {post.category && (
            <Badge variant="secondary">{post.category}</Badge>
          )}
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="size-4" />
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          {post.author?.name && (
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <User className="size-4" />
              {post.author.name}
            </span>
          )}
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="mt-3 text-lg text-muted-foreground">{post.excerpt}</p>
        )}
      </header>

      <Separator className="my-8" />

      {/* Body */}
      {post.body && (
        <article className="prose prose-neutral dark:prose-invert max-w-none whitespace-pre-line leading-relaxed">
          {post.body}
        </article>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <>
          <Separator className="my-8" />
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              Tags:
            </span>
            {tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
