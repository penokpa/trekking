import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getAgencyFromHeaders } from "@/lib/tenant";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GradientPlaceholder } from "@/components/shared/gradient-placeholder";
import {
  Mountain,
  Clock,
  Users,
  TrendingUp,
  DollarSign,
  Sun,
  MapPin,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  MessageSquare,
  Star,
  ChevronRight,
  ImageIcon,
  Calendar,
  Shield,
  ArrowRight,
} from "lucide-react";

type ItineraryDay = {
  day: number;
  title: string;
  description?: string;
  altitude?: number;
};

const difficultyColor: Record<string, string> = {
  EASY: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  MODERATE: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  CHALLENGING: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  STRENUOUS: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

const difficultyGradient: Record<string, string> = {
  EASY: "from-green-600 to-emerald-500",
  MODERATE: "from-yellow-600 to-amber-500",
  CHALLENGING: "from-orange-600 to-amber-500",
  STRENUOUS: "from-red-600 to-rose-500",
};

export default async function TrekDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const agency = await getAgencyFromHeaders();
  if (!agency) return null;

  const trek = await db.trek.findUnique({
    where: {
      agencyId_slug: {
        agencyId: agency.id,
        slug,
      },
    },
    include: {
      images: {
        orderBy: { displayOrder: "asc" },
      },
      testimonials: {
        orderBy: { date: "desc" },
        take: 6,
      },
    },
  });

  if (!trek || trek.status !== "PUBLISHED") {
    notFound();
  }

  // Fetch related treks
  const relatedTreks = await db.trek.findMany({
    where: {
      agencyId: agency.id,
      status: "PUBLISHED",
      id: { not: trek.id },
    },
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  const itinerary = (trek.itinerary as ItineraryDay[] | null) ?? [];
  const includes = (trek.includes as string[] | null) ?? [];
  const excludes = (trek.excludes as string[] | null) ?? [];

  // Calculate altitude profile data
  const altitudes = itinerary
    .filter((d) => d.altitude != null)
    .map((d) => d.altitude!);
  const maxAlt = altitudes.length > 0 ? Math.max(...altitudes) : 0;

  return (
    <div>
      {/* ─── Hero Banner ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        <div className="pattern-dots absolute inset-0" />
        <div className="absolute -left-32 top-0 size-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -right-20 bottom-0 size-80 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6 pb-12 pt-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-blue-200/60">
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <ChevronRight className="size-3.5" />
            <Link href="/treks" className="transition-colors hover:text-white">
              Treks
            </Link>
            <ChevronRight className="size-3.5" />
            <span className="text-blue-100/90">{trek.title}</span>
          </nav>

          {/* Title area */}
          <div className="mt-6 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              {trek.difficulty && (
                <Badge
                  className={`border-0 ${difficultyColor[trek.difficulty] ?? ""}`}
                >
                  {trek.difficulty}
                </Badge>
              )}
              {trek.region && (
                <Badge
                  variant="outline"
                  className="border-white/20 text-blue-100"
                >
                  <MapPin className="mr-1 size-3" />
                  {trek.region}
                </Badge>
              )}
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-5xl">
              {trek.title}
            </h1>
            {trek.summary && (
              <p className="mt-3 text-lg leading-relaxed text-blue-100/70">
                {trek.summary}
              </p>
            )}
          </div>

          {/* Hero stats overlay */}
          <div className="mt-8 flex flex-wrap gap-6 text-sm">
            {trek.duration && (
              <div className="flex items-center gap-2 text-blue-100/90">
                <div className="flex size-9 items-center justify-center rounded-lg bg-white/10">
                  <Clock className="size-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-blue-200/50">Duration</p>
                  <p className="font-semibold text-white">
                    {trek.duration} Days
                  </p>
                </div>
              </div>
            )}
            {trek.maxAltitude != null && (
              <div className="flex items-center gap-2 text-blue-100/90">
                <div className="flex size-9 items-center justify-center rounded-lg bg-white/10">
                  <TrendingUp className="size-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-blue-200/50">Max Altitude</p>
                  <p className="font-semibold text-white">
                    {trek.maxAltitude.toLocaleString()}m
                  </p>
                </div>
              </div>
            )}
            {trek.groupSize != null && (
              <div className="flex items-center gap-2 text-blue-100/90">
                <div className="flex size-9 items-center justify-center rounded-lg bg-white/10">
                  <Users className="size-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-blue-200/50">Group Size</p>
                  <p className="font-semibold text-white">
                    Up to {trek.groupSize}
                  </p>
                </div>
              </div>
            )}
            {trek.priceFrom != null && (
              <div className="flex items-center gap-2 text-blue-100/90">
                <div className="flex size-9 items-center justify-center rounded-lg bg-white/10">
                  <DollarSign className="size-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-blue-200/50">From</p>
                  <p className="font-semibold text-white">
                    ${trek.priceFrom.toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── Trip Facts Strip ─── */}
      <section className="border-b bg-gradient-to-r from-slate-50 to-blue-50/30 dark:from-slate-900/50 dark:to-blue-950/20">
        <div className="mx-auto max-w-6xl overflow-x-auto px-6">
          <div className="flex min-w-max items-center gap-0 py-0">
            {[
              trek.duration
                ? { icon: Clock, label: "Duration", value: `${trek.duration} Days` }
                : null,
              trek.difficulty
                ? { icon: Mountain, label: "Difficulty", value: trek.difficulty }
                : null,
              trek.maxAltitude != null
                ? { icon: TrendingUp, label: "Max Altitude", value: `${trek.maxAltitude.toLocaleString()}m` }
                : null,
              trek.groupSize != null
                ? { icon: Users, label: "Group Size", value: `Up to ${trek.groupSize}` }
                : null,
              trek.bestSeason
                ? { icon: Sun, label: "Best Season", value: trek.bestSeason }
                : null,
              trek.region
                ? { icon: MapPin, label: "Region", value: trek.region }
                : null,
            ]
              .filter(Boolean)
              .map((fact, i) => {
                const Icon = fact!.icon;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 border-r px-5 py-4 last:border-r-0"
                  >
                    <Icon className="size-4 shrink-0 text-primary" />
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                        {fact!.label}
                      </p>
                      <p className="text-sm font-semibold">{fact!.value}</p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </section>

      {/* ─── Main Content ─── */}
      <div className="mx-auto max-w-6xl px-6 py-10 md:py-14">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Left: Content */}
          <div className="space-y-12 lg:col-span-2">
            {/* Overview */}
            {trek.description && (
              <section id="overview">
                <h2 className="flex items-center gap-2 text-2xl font-bold">
                  <div className="h-7 w-1 rounded-full bg-primary" />
                  Overview
                </h2>
                <div className="mt-4 whitespace-pre-line text-[15px] leading-relaxed text-muted-foreground">
                  {trek.description}
                </div>
              </section>
            )}

            {/* Altitude Profile */}
            {altitudes.length > 2 && (
              <section>
                <h2 className="flex items-center gap-2 text-2xl font-bold">
                  <div className="h-7 w-1 rounded-full bg-primary" />
                  Altitude Profile
                </h2>
                <div className="mt-4 rounded-xl border bg-card p-5">
                  <div className="flex items-end gap-1.5" style={{ height: 160 }}>
                    {itinerary.map((day, i) => {
                      const alt = day.altitude ?? 0;
                      const pct = maxAlt > 0 ? (alt / maxAlt) * 100 : 0;
                      const isHighest = alt === maxAlt;
                      return (
                        <div
                          key={i}
                          className="group relative flex flex-1 flex-col items-center"
                          style={{ height: "100%" }}
                        >
                          {/* Tooltip */}
                          <div className="pointer-events-none absolute -top-8 z-10 whitespace-nowrap rounded bg-foreground/90 px-2 py-1 text-[10px] text-background opacity-0 transition-opacity group-hover:opacity-100">
                            Day {day.day}: {alt.toLocaleString()}m
                          </div>
                          <div className="flex-1" />
                          <div
                            className={`w-full min-w-[8px] rounded-t-sm transition-colors ${
                              isHighest
                                ? "bg-primary"
                                : "bg-primary/30 group-hover:bg-primary/60"
                            }`}
                            style={{ height: `${Math.max(pct, 4)}%` }}
                          />
                          <span className="mt-1.5 text-[9px] text-muted-foreground">
                            D{day.day}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Start</span>
                    <span className="font-medium text-primary">
                      Peak: {maxAlt.toLocaleString()}m
                    </span>
                    <span>End</span>
                  </div>
                </div>
              </section>
            )}

            {/* Itinerary */}
            {itinerary.length > 0 && (
              <section id="itinerary">
                <h2 className="flex items-center gap-2 text-2xl font-bold">
                  <div className="h-7 w-1 rounded-full bg-primary" />
                  Day-by-Day Itinerary
                </h2>
                <div className="mt-6 space-y-0">
                  {itinerary.map((day, idx) => (
                    <div
                      key={day.day}
                      className="group relative flex gap-4 pb-8"
                    >
                      {/* Timeline line */}
                      {idx < itinerary.length - 1 && (
                        <div className="absolute left-[19px] top-10 h-full w-px bg-gradient-to-b from-primary/30 to-border" />
                      )}
                      {/* Day circle */}
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-md shadow-primary/20 transition-transform group-hover:scale-110">
                        {day.day}
                      </div>
                      <div className="flex-1 rounded-lg border border-transparent px-3 pt-1.5 transition-colors group-hover:border-border group-hover:bg-muted/30">
                        <div className="flex flex-wrap items-center gap-3">
                          <p className="font-semibold">{day.title}</p>
                          {day.altitude != null && (
                            <Badge
                              variant="secondary"
                              className="text-xs font-normal"
                            >
                              <TrendingUp className="mr-1 size-3" />
                              {day.altitude.toLocaleString()}m
                            </Badge>
                          )}
                        </div>
                        {day.description && (
                          <p className="mt-1.5 pb-2 text-sm leading-relaxed text-muted-foreground">
                            {day.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Includes / Excludes */}
            {(includes.length > 0 || excludes.length > 0) && (
              <section id="includes">
                <h2 className="flex items-center gap-2 text-2xl font-bold">
                  <div className="h-7 w-1 rounded-full bg-primary" />
                  Cost Details
                </h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {includes.length > 0 && (
                    <div className="rounded-xl border border-green-200/60 bg-green-50/60 p-5 dark:border-green-800/30 dark:bg-green-950/20">
                      <h3 className="flex items-center gap-2 font-semibold text-green-800 dark:text-green-300">
                        <CheckCircle2 className="size-5" />
                        What&apos;s Included
                      </h3>
                      <ul className="mt-3 space-y-2.5">
                        {includes.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-2 text-sm"
                          >
                            <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-green-600 dark:text-green-400" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {excludes.length > 0 && (
                    <div className="rounded-xl border border-red-200/60 bg-red-50/60 p-5 dark:border-red-800/30 dark:bg-red-950/20">
                      <h3 className="flex items-center gap-2 font-semibold text-red-800 dark:text-red-300">
                        <XCircle className="size-5" />
                        Not Included
                      </h3>
                      <ul className="mt-3 space-y-2.5">
                        {excludes.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-2 text-sm"
                          >
                            <XCircle className="mt-0.5 size-3.5 shrink-0 text-red-500 dark:text-red-400" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Gallery */}
            {trek.images.length > 0 && (
              <section id="gallery">
                <h2 className="flex items-center gap-2 text-2xl font-bold">
                  <div className="h-7 w-1 rounded-full bg-primary" />
                  Gallery
                </h2>
                <div className="mt-4 grid gap-3 grid-cols-2 md:grid-cols-3">
                  {trek.images.map((image, i) => (
                    <div
                      key={image.id}
                      className="group relative overflow-hidden rounded-xl shadow-sm transition-shadow hover:shadow-lg"
                    >
                      <GradientPlaceholder
                        index={i}
                        className="aspect-[4/3]"
                      >
                        <ImageIcon className="size-8 text-white/30" />
                      </GradientPlaceholder>
                      {image.caption && (
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2.5 pt-6 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                          {image.caption}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Reviews */}
            {trek.testimonials.length > 0 && (
              <section id="reviews">
                <h2 className="flex items-center gap-2 text-2xl font-bold">
                  <div className="h-7 w-1 rounded-full bg-primary" />
                  Reviews
                </h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {trek.testimonials.map((review) => (
                    <Card
                      key={review.id}
                      className="relative overflow-hidden border-0 bg-gradient-to-br from-card to-muted/20 shadow-sm"
                    >
                      <div className="absolute right-3 top-1 select-none text-6xl font-serif leading-none text-primary/5">
                        &ldquo;
                      </div>
                      <CardContent className="relative pt-5">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`size-3.5 ${
                                i < (review.rating ?? 0)
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-muted-foreground/30"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="mt-2.5 text-sm italic leading-relaxed text-muted-foreground">
                          &ldquo;{review.reviewText}&rdquo;
                        </p>
                        <div className="mt-3 flex items-center gap-2">
                          <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                            {review.clientName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {review.clientName}
                            </p>
                            {review.country && (
                              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                <MapPin className="size-2.5" />
                                {review.country}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Related Treks */}
            {relatedTreks.length > 0 && (
              <section>
                <h2 className="flex items-center gap-2 text-2xl font-bold">
                  <div className="h-7 w-1 rounded-full bg-primary" />
                  Other Treks You May Like
                </h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {relatedTreks.map((related, i) => (
                    <Link
                      key={related.id}
                      href={`/treks/${related.slug}`}
                      className="group"
                    >
                      <Card className="overflow-hidden border-0 shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
                        <GradientPlaceholder
                          index={i + 2}
                          className="h-32"
                        >
                          <Mountain className="size-8 text-white/30" />
                        </GradientPlaceholder>
                        <CardContent className="p-4">
                          <p className="font-semibold transition-colors group-hover:text-primary">
                            {related.title}
                          </p>
                          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                            {related.duration && (
                              <span className="flex items-center gap-1">
                                <Clock className="size-3" />
                                {related.duration} days
                              </span>
                            )}
                            {related.difficulty && (
                              <Badge
                                variant="outline"
                                className="text-[10px] px-1.5 py-0"
                              >
                                {related.difficulty}
                              </Badge>
                            )}
                          </div>
                          {related.priceFrom != null && (
                            <p className="mt-2 text-sm font-semibold text-primary">
                              From ${related.priceFrom.toLocaleString()}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* ─── Sidebar ─── */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-5">
              {/* Price Card */}
              <Card className="overflow-hidden border-0 shadow-lg">
                <div
                  className={`h-2 bg-gradient-to-r ${
                    trek.difficulty
                      ? difficultyGradient[trek.difficulty] ?? "from-blue-600 to-cyan-500"
                      : "from-blue-600 to-cyan-500"
                  }`}
                />
                <CardContent className="p-5">
                  {trek.priceFrom != null && (
                    <div className="text-center">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">
                        Starting from
                      </p>
                      <p className="mt-1 text-4xl font-bold text-primary">
                        ${trek.priceFrom.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        per person
                      </p>
                    </div>
                  )}

                  <Separator className="my-4" />

                  {/* Quick facts in sidebar */}
                  <div className="space-y-3">
                    {trek.duration && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="size-4" />
                          Duration
                        </span>
                        <span className="font-medium">
                          {trek.duration} days
                        </span>
                      </div>
                    )}
                    {trek.difficulty && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-muted-foreground">
                          <Mountain className="size-4" />
                          Difficulty
                        </span>
                        <Badge
                          variant="outline"
                          className={`text-xs ${difficultyColor[trek.difficulty] ?? ""}`}
                        >
                          {trek.difficulty}
                        </Badge>
                      </div>
                    )}
                    {trek.maxAltitude != null && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-muted-foreground">
                          <TrendingUp className="size-4" />
                          Max Altitude
                        </span>
                        <span className="font-medium">
                          {trek.maxAltitude.toLocaleString()}m
                        </span>
                      </div>
                    )}
                    {trek.bestSeason && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-muted-foreground">
                          <Sun className="size-4" />
                          Best Season
                        </span>
                        <span className="text-xs font-medium">
                          {trek.bestSeason}
                        </span>
                      </div>
                    )}
                    {trek.region && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="size-4" />
                          Region
                        </span>
                        <span className="font-medium">{trek.region}</span>
                      </div>
                    )}
                  </div>

                  <Separator className="my-4" />

                  <Button
                    asChild
                    className="w-full shadow-md shadow-primary/20"
                    size="lg"
                  >
                    <Link href={`/contact?trek=${trek.id}`}>
                      <MessageSquare className="mr-2 size-4" />
                      Inquire Now
                    </Link>
                  </Button>
                  <p className="mt-2.5 text-center text-xs text-muted-foreground">
                    No commitment — get a free quote
                  </p>
                </CardContent>
              </Card>

              {/* Trust signals */}
              <Card className="border-0 bg-muted/30 shadow-sm">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Shield className="size-4 shrink-0 text-green-600" />
                      <span className="text-muted-foreground">
                        Licensed & insured guides
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="size-4 shrink-0 text-green-600" />
                      <span className="text-muted-foreground">
                        Free cancellation up to 30 days
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Users className="size-4 shrink-0 text-green-600" />
                      <span className="text-muted-foreground">
                        Small group departures
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Back link */}
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="w-full text-muted-foreground"
              >
                <Link href="/treks">
                  <ArrowLeft className="mr-1 size-4" />
                  Back to All Treks
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
