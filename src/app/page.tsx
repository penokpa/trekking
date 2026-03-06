import Link from "next/link";
import { getAgencyFromHeaders } from "@/lib/tenant";
import { AgencyProvider } from "@/components/shared/agency-provider";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { AgencyHomePage } from "@/components/public/agency-homepage";
import { Button } from "@/components/ui/button";
import { Mountain } from "lucide-react";

export default async function RootPage() {
  const agency = await getAgencyFromHeaders();

  if (agency) {
    return (
      <AgencyProvider agency={agency}>
        <div className="flex min-h-screen flex-col" data-brand>
          <PublicHeader />
          <main className="flex-1">
            <AgencyHomePage agencyId={agency.id} agencyName={agency.name} />
          </main>
          <PublicFooter />
        </div>
      </AgencyProvider>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Mountain className="h-6 w-6" />
            <span className="text-xl font-bold">Trekking Platform</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign in</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Build your trekking agency website
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Create a professional website for your trekking and expedition
            company. Manage treks, bookings, blog, gallery, and more — all from
            one platform.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg">Start Free Trial</Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Trekking Platform. All rights
          reserved.
        </div>
      </footer>
    </div>
  );
}
