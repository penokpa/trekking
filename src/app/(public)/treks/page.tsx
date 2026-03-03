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
import {
  Mountain,
  Clock,
  ArrowRight,
  Sun,
  MapPin,
} from "lucide-react";

const difficultyColor: Record<string, string> = {
  EASY: "bg-green-100 text-green-800",
  MODERATE: "bg-yellow-100 text-yellow-800",
  CHALLENGING: "bg-orange-100 text-orange-800",
  STRENUOUS: "bg-red-100 text-red-800",
};

export default async function PublicTreksPage() {
  const agency = await getAgencyFromHeaders();
  if (!agency) return null;

  const treks = await db.trek.findMany({
    where: {
      agencyId: agency.id,
      status: "PUBLISHED",
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">Our Treks</h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Explore our curated collection of trekking experiences across the
          Himalayas. From moderate valley walks to challenging high-altitude
          expeditions.
        </p>
      </div>

      {treks.length === 0 ? (
        <div className="mt-16 text-center">
          <Mountain className="mx-auto size-12 text-muted-foreground/40" />
          <p className="mt-4 text-muted-foreground">
            No treks available at the moment. Check back soon!
          </p>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {treks.map((trek) => (
            <Card key={trek.id} className="overflow-hidden">
              <div className="flex h-44 items-center justify-center bg-muted">
                <Mountain className="size-12 text-muted-foreground/50" />
              </div>
              <CardHeader>
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
                <CardTitle className="text-lg">{trek.title}</CardTitle>
                {trek.summary && (
                  <CardDescription className="line-clamp-2">
                    {trek.summary}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                  {trek.duration && (
                    <span className="flex items-center gap-1">
                      <Clock className="size-4" />
                      {trek.duration} days
                    </span>
                  )}
                  {trek.bestSeason && (
                    <span className="flex items-center gap-1">
                      <Sun className="size-4" />
                      {trek.bestSeason}
                    </span>
                  )}
                </div>
                {trek.priceFrom != null && (
                  <p className="mt-3 text-lg font-semibold">
                    From ${trek.priceFrom.toLocaleString()}
                  </p>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link href={`/treks/${trek.slug}`}>
                    View Details
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
