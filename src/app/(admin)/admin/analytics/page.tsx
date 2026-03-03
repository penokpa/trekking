import { db } from "@/lib/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Building2, Globe } from "lucide-react";

export default async function AdminAnalyticsPage() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [totalViews, pageViews] = await Promise.all([
    db.pageView.count({
      where: { createdAt: { gte: thirtyDaysAgo } },
    }),
    db.pageView.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: {
        agencyId: true,
        country: true,
        agency: { select: { name: true } },
      },
    }),
  ]);

  // Group by agency
  const agencyViewMap = new Map<string, { name: string; count: number }>();
  for (const view of pageViews) {
    const existing = agencyViewMap.get(view.agencyId);
    if (existing) {
      existing.count++;
    } else {
      agencyViewMap.set(view.agencyId, {
        name: view.agency.name,
        count: 1,
      });
    }
  }
  const topAgencies = Array.from(agencyViewMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Group by country
  const countryViewMap = new Map<string, number>();
  for (const view of pageViews) {
    const country = view.country ?? "Unknown";
    countryViewMap.set(country, (countryViewMap.get(country) ?? 0) + 1);
  }
  const topCountries = Array.from(countryViewMap.entries())
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  function formatNumber(num: number): string {
    return new Intl.NumberFormat("en-US").format(num);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Platform Analytics</h1>
        <p className="mt-2 text-muted-foreground">
          Platform-wide analytics for the last 30 days.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Total Views (30d)</CardDescription>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(totalViews)}</div>
            <p className="text-xs text-muted-foreground">Page views across all agencies</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Agencies with Traffic</CardDescription>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(agencyViewMap.size)}</div>
            <p className="text-xs text-muted-foreground">Agencies that received views</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Countries Reached</CardDescription>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(countryViewMap.size)}</div>
            <p className="text-xs text-muted-foreground">Unique visitor countries</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Agencies by Views</CardTitle>
            <CardDescription>Agencies with the most page views in the last 30 days.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8">#</TableHead>
                  <TableHead>Agency</TableHead>
                  <TableHead className="text-right">Views</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topAgencies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      No page views recorded yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  topAgencies.map((agency, index) => (
                    <TableRow key={agency.name}>
                      <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                      <TableCell className="font-medium">{agency.name}</TableCell>
                      <TableCell className="text-right">{formatNumber(agency.count)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Countries</CardTitle>
            <CardDescription>Countries with the most page views in the last 30 days.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8">#</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead className="text-right">Views</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topCountries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      No page views recorded yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  topCountries.map((entry, index) => (
                    <TableRow key={entry.country}>
                      <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                      <TableCell className="font-medium">{entry.country}</TableCell>
                      <TableCell className="text-right">{formatNumber(entry.count)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
