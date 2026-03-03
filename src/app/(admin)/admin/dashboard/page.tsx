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
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Users,
  Mountain,
  MessageSquare,
  Eye,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const [
    totalAgencies,
    totalUsers,
    totalTreks,
    totalInquiries,
    totalPageViews,
    recentAgencies,
  ] = await Promise.all([
    db.agency.count(),
    db.user.count(),
    db.trek.count(),
    db.inquiry.count(),
    db.pageView.count(),
    db.agency.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        subscription: { include: { plan: true } },
        _count: { select: { members: true } },
      },
    }),
  ]);

  const stats = [
    {
      label: "Total Agencies",
      value: totalAgencies,
      icon: Building2,
      description: "Registered agencies on the platform",
    },
    {
      label: "Total Users",
      value: totalUsers,
      icon: Users,
      description: "All user accounts",
    },
    {
      label: "Total Treks",
      value: totalTreks,
      icon: Mountain,
      description: "Treks across all agencies",
    },
    {
      label: "Total Inquiries",
      value: totalInquiries,
      icon: MessageSquare,
      description: "Customer inquiries received",
    },
    {
      label: "Total Page Views",
      value: totalPageViews,
      icon: Eye,
      description: "Platform-wide page views",
    },
  ];

  function formatDate(date: Date): string {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  }

  function formatNumber(num: number): string {
    return new Intl.NumberFormat("en-US").format(num);
  }

  function statusVariant(status: string) {
    switch (status) {
      case "ACTIVE":
        return "default" as const;
      case "PENDING":
        return "secondary" as const;
      case "SUSPENDED":
        return "destructive" as const;
      default:
        return "outline" as const;
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Platform overview and key metrics.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>{stat.label}</CardDescription>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(stat.value)}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Agencies</CardTitle>
          <CardDescription>Last 5 agencies created on the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead className="text-right">Members</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentAgencies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No agencies found.
                  </TableCell>
                </TableRow>
              ) : (
                recentAgencies.map((agency) => (
                  <TableRow key={agency.id}>
                    <TableCell className="font-medium">{agency.name}</TableCell>
                    <TableCell className="text-muted-foreground">{agency.slug}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(agency.status)}>
                        {agency.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {agency.subscription?.plan.name ?? (
                        <span className="text-muted-foreground">No plan</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">{agency._count.members}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(agency.createdAt)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
