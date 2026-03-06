import Link from "next/link";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GradientPlaceholder } from "@/components/shared/gradient-placeholder";
import {
  Mountain,
  Clock,
  Star,
  MapPin,
  Users,
  Award,
  ArrowRight,
} from "lucide-react";

interface AgencyHomePageProps {
  agencyId: string;
  agencyName: string | null;
}

export async function AgencyHomePage({
  agencyId,
  agencyName,
}: AgencyHomePageProps) {
  const [banner, featuredTreks, featuredTestimonials, agencyRecord] =
    await Promise.all([
      db.banner.findFirst({
        where: {
          agencyId,
          location: "HOME",
          status: "ACTIVE",
        },
        orderBy: { startDate: "desc" },
      }),
      db.trek.findMany({
        where: {
          agencyId,
          status: "PUBLISHED",
          featured: true,
        },
        take: 3,
        orderBy: { createdAt: "desc" },
      }),
      db.testimonial.findMany({
        where: {
          agencyId,
          featured: true,
        },
        take: 3,
        orderBy: { date: "desc" },
      }),
      db.agency.findUnique({
        where: { id: agencyId },
        select: { stats: true },
      }),
    ]);

  const stats = (agencyRecord?.stats as Record<string, number> | null) ?? {};

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-blue-800 py-24 md:py-36">
        {/* Decorative bokeh circles */}
        <div className="absolute -left-20 -top-20 size-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute -bottom-20 right-10 size-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="pattern-dots absolute inset-0" />

        <div className="relative mx-auto max-w-5xl px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
            {banner?.title ?? `Explore the Himalayas with ${agencyName}`}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100/80 md:text-xl">
            {banner?.subtitle ??
              "Discover breathtaking treks, experienced guides, and unforgettable mountain adventures."}
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Button
              size="lg"
              asChild
              className="bg-white text-slate-900 hover:bg-white/90"
            >
              <Link href={banner?.ctaLink ?? "/treks"}>
                {banner?.ctaText ?? "View Our Treks"}
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white/30 text-white hover:bg-white/10"
            >
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
            {featuredTreks.map((trek, i) => (
              <Card
                key={trek.id}
                className="group overflow-hidden border-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <GradientPlaceholder index={i} className="h-48">
                  <Mountain className="size-12 text-white/40" />
                </GradientPlaceholder>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    {trek.difficulty && (
                      <Badge variant="secondary">{trek.difficulty}</Badge>
                    )}
                    {trek.region && (
                      <Badge variant="outline">{trek.region}</Badge>
                    )}
                  </div>
                  <CardTitle className="mt-1 text-lg transition-colors group-hover:text-primary">
                    {trek.title}
                  </CardTitle>
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
                      <span className="font-semibold text-primary">
                        From ${trek.priceFrom.toLocaleString()}
                      </span>
                    )}
                  </div>
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
          <div className="mt-10 text-center">
            <Button variant="outline" size="lg" asChild>
              <Link href="/treks">View All Treks</Link>
            </Button>
          </div>
        </section>
      )}

      {/* Stats Section */}
      {Object.keys(stats).length > 0 && (
        <section className="border-y bg-gradient-to-r from-slate-50 to-blue-50/50 py-16 dark:from-slate-900/50 dark:to-blue-950/30 md:py-20">
          <div className="mx-auto max-w-4xl px-6">
            <div className="grid gap-8 text-center sm:grid-cols-3">
              {stats.treksCompleted != null && (
                <div>
                  <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10">
                    <Award className="size-7 text-primary" />
                  </div>
                  <p className="mt-4 text-4xl font-bold">
                    {stats.treksCompleted}+
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Treks Completed
                  </p>
                </div>
              )}
              {stats.happyClients != null && (
                <div>
                  <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10">
                    <Users className="size-7 text-primary" />
                  </div>
                  <p className="mt-4 text-4xl font-bold">
                    {stats.happyClients}+
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Happy Clients
                  </p>
                </div>
              )}
              {stats.yearsExperience != null && (
                <div>
                  <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10">
                    <Mountain className="size-7 text-primary" />
                  </div>
                  <p className="mt-4 text-4xl font-bold">
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
              <Card
                key={testimonial.id}
                className="relative overflow-hidden border-0 bg-gradient-to-br from-card to-muted/30 shadow-sm"
              >
                {/* Decorative quote */}
                <div className="absolute right-4 top-2 select-none text-8xl font-serif leading-none text-primary/5">
                  &ldquo;
                </div>
                <CardHeader className="relative">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`size-4 ${
                          i < (testimonial.rating ?? 0)
                            ? "fill-amber-400 text-amber-400"
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
                <CardContent className="relative">
                  <p className="text-sm italic leading-relaxed text-muted-foreground">
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
