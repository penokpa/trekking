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
import { GradientPlaceholder } from "@/components/shared/gradient-placeholder";
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
    <div>
      {/* Gradient banner header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-blue-800 py-16 md:py-20">
        <div className="pattern-dots absolute inset-0" />
        <div className="relative mx-auto max-w-6xl px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Our Treks
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-blue-100/80">
            Explore our curated collection of trekking experiences across the
            Himalayas. From moderate valley walks to challenging high-altitude
            expeditions.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        {treks.length === 0 ? (
          <div className="mt-16 text-center">
            <Mountain className="mx-auto size-12 text-muted-foreground/40" />
            <p className="mt-4 text-muted-foreground">
              No treks available at the moment. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {treks.map((trek, i) => (
              <Card
                key={trek.id}
                className="group overflow-hidden border-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <GradientPlaceholder index={i} className="h-44">
                  <Mountain className="size-12 text-white/40" />
                </GradientPlaceholder>
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
                  <CardTitle className="text-lg transition-colors group-hover:text-primary">
                    {trek.title}
                  </CardTitle>
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
                    <p className="mt-3 text-lg font-semibold text-primary">
                      From ${trek.priceFrom.toLocaleString()}
                    </p>
                  )}
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="w-full transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
                  >
                    <Link href={`/treks/${trek.slug}`}>
                      View Details
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
