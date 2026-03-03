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
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Mountain,
  Clock,
  Star,
  MapPin,
  Users,
  Award,
  ArrowRight,
} from "lucide-react";

export default async function PublicHomePage() {
  const agency = await getAgencyFromHeaders();
  if (!agency) return null;

  const [banner, featuredTreks, featuredTestimonials, agencyRecord] =
    await Promise.all([
      db.banner.findFirst({
        where: {
          agencyId: agency.id,
          location: "HOME",
          status: "ACTIVE",
        },
        orderBy: { startDate: "desc" },
      }),
      db.trek.findMany({
        where: {
          agencyId: agency.id,
          status: "PUBLISHED",
          featured: true,
        },
        take: 3,
        orderBy: { createdAt: "desc" },
      }),
      db.testimonial.findMany({
        where: {
          agencyId: agency.id,
          featured: true,
        },
        take: 3,
        orderBy: { date: "desc" },
      }),
      db.agency.findUnique({
        where: { id: agency.id },
        select: { stats: true },
      }),
    ]);

  const stats = (agencyRecord?.stats as Record<string, number> | null) ?? {};

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-muted/40 py-20 md:py-32">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            {banner?.title ?? `Explore the Himalayas with ${agency.name}`}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground md:text-xl">
            {banner?.subtitle ??
              "Discover breathtaking treks, experienced guides, and unforgettable mountain adventures."}
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href={banner?.ctaLink ?? "/treks"}>
                {banner?.ctaText ?? "View Our Treks"}
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Treks */}
      {featuredTreks.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Featured Treks</h2>
            <p className="mt-2 text-muted-foreground">
              Our most popular trekking experiences
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredTreks.map((trek) => (
              <Card key={trek.id} className="overflow-hidden">
                <div className="flex h-48 items-center justify-center bg-muted">
                  <Mountain className="size-12 text-muted-foreground/50" />
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    {trek.difficulty && (
                      <Badge variant="secondary">{trek.difficulty}</Badge>
                    )}
                    {trek.region && (
                      <Badge variant="outline">{trek.region}</Badge>
                    )}
                  </div>
                  <CardTitle className="mt-1 text-lg">{trek.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    {trek.duration && (
                      <span className="flex items-center gap-1">
                        <Clock className="size-4" />
                        {trek.duration} days
                      </span>
                    )}
                    {trek.priceFrom != null && (
                      <span className="font-semibold text-foreground">
                        From ${trek.priceFrom.toLocaleString()}
                      </span>
                    )}
                  </div>
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
          <div className="mt-10 text-center">
            <Button variant="outline" size="lg" asChild>
              <Link href="/treks">View All Treks</Link>
            </Button>
          </div>
        </section>
      )}

      <Separator />

      {/* Stats Section */}
      {Object.keys(stats).length > 0 && (
        <section className="bg-muted/40 py-16 md:py-20">
          <div className="mx-auto max-w-4xl px-6">
            <div className="grid gap-8 sm:grid-cols-3 text-center">
              {stats.treksCompleted != null && (
                <div>
                  <Award className="mx-auto size-8 text-primary" />
                  <p className="mt-3 text-3xl font-bold">
                    {stats.treksCompleted}+
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Treks Completed
                  </p>
                </div>
              )}
              {stats.happyClients != null && (
                <div>
                  <Users className="mx-auto size-8 text-primary" />
                  <p className="mt-3 text-3xl font-bold">
                    {stats.happyClients}+
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Happy Clients
                  </p>
                </div>
              )}
              {stats.yearsExperience != null && (
                <div>
                  <Mountain className="mx-auto size-8 text-primary" />
                  <p className="mt-3 text-3xl font-bold">
                    {stats.yearsExperience}+
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Years Experience
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <Separator />

      {/* Testimonials */}
      {featuredTestimonials.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <div className="text-center">
            <h2 className="text-3xl font-bold">What Our Clients Say</h2>
            <p className="mt-2 text-muted-foreground">
              Hear from trekkers who journeyed with us
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredTestimonials.map((testimonial) => (
              <Card key={testimonial.id}>
                <CardHeader>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`size-4 ${
                          i < (testimonial.rating ?? 0)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                  <CardTitle className="text-base">
                    {testimonial.clientName}
                  </CardTitle>
                  {testimonial.country && (
                    <p className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="size-3" />
                      {testimonial.country}
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    &ldquo;{testimonial.reviewText}&rdquo;
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
