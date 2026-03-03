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
} from "lucide-react";

type ItineraryDay = {
  day: number;
  title: string;
  description?: string;
  altitude?: number;
};

const difficultyColor: Record<string, string> = {
  EASY: "bg-green-100 text-green-800",
  MODERATE: "bg-yellow-100 text-yellow-800",
  CHALLENGING: "bg-orange-100 text-orange-800",
  STRENUOUS: "bg-red-100 text-red-800",
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
  });

  if (!trek || trek.status !== "PUBLISHED") {
    notFound();
  }

  const itinerary = (trek.itinerary as ItineraryDay[] | null) ?? [];
  const includes = (trek.includes as string[] | null) ?? [];
  const excludes = (trek.excludes as string[] | null) ?? [];

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
      {/* Back link */}
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link href="/treks">
          <ArrowLeft className="mr-1 size-4" />
          Back to Treks
        </Link>
      </Button>

      <div className="grid gap-10 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Cover area */}
          <div className="flex h-64 items-center justify-center rounded-xl bg-muted md:h-80">
            <Mountain className="size-16 text-muted-foreground/40" />
          </div>

          {/* Title and badges */}
          <div className="mt-8">
            <div className="flex flex-wrap items-center gap-2">
              {trek.difficulty && (
                <Badge
                  variant="outline"
                  className={difficultyColor[trek.difficulty] ?? ""}
                >
                  {trek.difficulty}
                </Badge>
              )}
              {trek.region && (
                <Badge variant="secondary">
                  <MapPin className="mr-1 size-3" />
                  {trek.region}
                </Badge>
              )}
            </div>
            <h1 className="mt-3 text-3xl font-bold md:text-4xl">
              {trek.title}
            </h1>
            {trek.summary && (
              <p className="mt-3 text-lg text-muted-foreground">
                {trek.summary}
              </p>
            )}
          </div>

          {/* Description */}
          {trek.description && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold">Overview</h2>
              <div className="mt-3 whitespace-pre-line leading-relaxed text-muted-foreground">
                {trek.description}
              </div>
            </div>
          )}

          <Separator className="my-10" />

          {/* Itinerary */}
          {itinerary.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold">Day-by-Day Itinerary</h2>
              <div className="mt-6 space-y-0">
                {itinerary.map((day, idx) => (
                  <div key={day.day} className="relative flex gap-4 pb-8">
                    {/* Timeline line */}
                    {idx < itinerary.length - 1 && (
                      <div className="absolute left-[15px] top-8 h-full w-px bg-border" />
                    )}
                    {/* Day circle */}
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      {day.day}
                    </div>
                    <div className="pt-0.5">
                      <p className="font-medium">{day.title}</p>
                      {day.description && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {day.description}
                        </p>
                      )}
                      {day.altitude != null && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                          <TrendingUp className="size-3" />
                          {day.altitude.toLocaleString()}m
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Includes / Excludes */}
          {(includes.length > 0 || excludes.length > 0) && (
            <>
              <Separator className="my-10" />
              <div className="grid gap-8 sm:grid-cols-2">
                {includes.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold">What&apos;s Included</h2>
                    <ul className="mt-4 space-y-2">
                      {includes.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-sm"
                        >
                          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-green-600" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {excludes.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold">Not Included</h2>
                    <ul className="mt-4 space-y-2">
                      {excludes.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-sm"
                        >
                          <XCircle className="mt-0.5 size-4 shrink-0 text-red-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Quick Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {trek.priceFrom != null && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="size-4" />
                    Price From
                  </span>
                  <span className="text-lg font-bold">
                    ${trek.priceFrom.toLocaleString()}
                  </span>
                </div>
              )}
              <Separator />
              {trek.duration && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="size-4" />
                    Duration
                  </span>
                  <span className="font-medium">{trek.duration} days</span>
                </div>
              )}
              {trek.difficulty && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mountain className="size-4" />
                    Difficulty
                  </span>
                  <Badge
                    variant="outline"
                    className={difficultyColor[trek.difficulty] ?? ""}
                  >
                    {trek.difficulty}
                  </Badge>
                </div>
              )}
              {trek.maxAltitude != null && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TrendingUp className="size-4" />
                    Max Altitude
                  </span>
                  <span className="font-medium">
                    {trek.maxAltitude.toLocaleString()}m
                  </span>
                </div>
              )}
              {trek.groupSize != null && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="size-4" />
                    Group Size
                  </span>
                  <span className="font-medium">Up to {trek.groupSize}</span>
                </div>
              )}
              {trek.bestSeason && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Sun className="size-4" />
                    Best Season
                  </span>
                  <span className="text-sm font-medium">{trek.bestSeason}</span>
                </div>
              )}
              {trek.region && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="size-4" />
                    Region
                  </span>
                  <span className="font-medium">{trek.region}</span>
                </div>
              )}
              <Separator />
              <Button asChild className="w-full" size="lg">
                <Link href="/contact">
                  <MessageSquare className="mr-2 size-4" />
                  Inquire Now
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
