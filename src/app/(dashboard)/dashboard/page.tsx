import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Mountain,
  FileText,
  MessageSquare,
  Eye,
  Plus,
  ArrowRight,
} from "lucide-react";

export default async function DashboardOverviewPage() {
  const session = await auth();
  const agencyId = session!.user.agencyId!;

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [trekCount, blogCount, newInquiryCount, pageViewCount, recentInquiries] =
    await Promise.all([
      db.trek.count({ where: { agencyId } }),
      db.blogPost.count({ where: { agencyId } }),
      db.inquiry.count({ where: { agencyId, status: "NEW" } }),
      db.pageView.count({
        where: { agencyId, createdAt: { gte: thirtyDaysAgo } },
      }),
      db.inquiry.findMany({
        where: { agencyId },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { trek: { select: { title: true } } },
      }),
    ]);

  const stats = [
    {
      label: "Total Treks",
      value: trekCount,
      icon: Mountain,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Blog Posts",
      value: blogCount,
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "New Inquiries",
      value: newInquiryCount,
      icon: MessageSquare,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      label: "Page Views (30d)",
      value: pageViewCount,
      icon: Eye,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  const inquiryStatusColor: Record<string, string> = {
    NEW: "bg-blue-100 text-blue-800",
    READ: "bg-yellow-100 text-yellow-800",
    REPLIED: "bg-green-100 text-green-800",
    ARCHIVED: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Overview of your agency.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4">
              <div className={`rounded-lg p-3 ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Inquiries */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Inquiries</CardTitle>
          <CardDescription>Latest customer inquiries for your agency</CardDescription>
        </CardHeader>
        <CardContent>
          {recentInquiries.length === 0 ? (
            <p className="text-sm text-muted-foreground">No inquiries yet.</p>
          ) : (
            <div className="space-y-4">
              {recentInquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{inquiry.name}</p>
                    <p className="text-sm text-muted-foreground">{inquiry.email}</p>
                    {inquiry.trek && (
                      <p className="text-sm text-muted-foreground">
                        Trek: {inquiry.trek.title}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="secondary"
                      className={inquiryStatusColor[inquiry.status]}
                    >
                      {inquiry.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {inquiry.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks to manage your agency</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="#">
                <Plus className="h-4 w-4" />
                Create Trek
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="#">
                <FileText className="h-4 w-4" />
                Write Blog Post
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard/inquiries">
                <MessageSquare className="h-4 w-4" />
                View Inquiries
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
