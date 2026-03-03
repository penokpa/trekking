import { auth } from "@/lib/auth";
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
import { Eye } from "lucide-react";

export default async function DashboardAnalyticsPage() {
  const session = await auth();
  const agencyId = session!.user.agencyId!;

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const pageViews = await db.pageView.findMany({
    where: { agencyId, createdAt: { gte: thirtyDaysAgo } },
  });

  const totalViews = pageViews.length;

  // Group by path
  const pathCounts = new Map<string, number>();
  for (const view of pageViews) {
    pathCounts.set(view.path, (pathCounts.get(view.path) ?? 0) + 1);
  }
  const topPages = Array.from(pathCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  // Group by referrer
  const referrerCounts = new Map<string, number>();
  for (const view of pageViews) {
    const ref = view.referrer ?? "Direct";
    referrerCounts.set(ref, (referrerCounts.get(ref) ?? 0) + 1);
  }
  const topReferrers = Array.from(referrerCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  // Group by country
  const countryCounts = new Map<string, number>();
  for (const view of pageViews) {
    const country = view.country ?? "Unknown";
    countryCounts.set(country, (countryCounts.get(country) ?? 0) + 1);
  }
  const topCountries = Array.from(countryCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="mt-2 text-muted-foreground">
          View site analytics and metrics for the last 30 days.
        </p>
      </div>

      {/* Total Views Card */}
      <Card>
        <CardContent className="flex items-center gap-4">
          <div className="rounded-lg bg-purple-50 p-3">
            <Eye className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              Total Page Views (Last 30 Days)
            </p>
            <p className="text-3xl font-bold">{totalViews}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
            <CardDescription>Most visited pages</CardDescription>
          </CardHeader>
          <CardContent>
            {topPages.length === 0 ? (
              <p className="text-sm text-muted-foreground">No data yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Path</TableHead>
                    <TableHead className="text-right">Views</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topPages.map(([path, count]) => (
                    <TableRow key={path}>
                      <TableCell className="font-mono text-sm">
                        {path}
                      </TableCell>
                      <TableCell className="text-right">{count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Top Referrers */}
        <Card>
          <CardHeader>
            <CardTitle>Top Referrers</CardTitle>
            <CardDescription>Traffic sources</CardDescription>
          </CardHeader>
          <CardContent>
            {topReferrers.length === 0 ? (
              <p className="text-sm text-muted-foreground">No data yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Referrer</TableHead>
                    <TableHead className="text-right">Views</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topReferrers.map(([referrer, count]) => (
                    <TableRow key={referrer}>
                      <TableCell className="text-sm">
                        {referrer.length > 30
                          ? `${referrer.slice(0, 30)}...`
                          : referrer}
                      </TableCell>
                      <TableCell className="text-right">{count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Top Countries */}
        <Card>
          <CardHeader>
            <CardTitle>Top Countries</CardTitle>
            <CardDescription>Visitor locations</CardDescription>
          </CardHeader>
          <CardContent>
            {topCountries.length === 0 ? (
              <p className="text-sm text-muted-foreground">No data yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Country</TableHead>
                    <TableHead className="text-right">Views</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topCountries.map(([country, count]) => (
                    <TableRow key={country}>
                      <TableCell>{country}</TableCell>
                      <TableCell className="text-right">{count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
