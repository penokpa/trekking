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

export default async function AdminAgenciesPage() {
  const agencies = await db.agency.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      subscription: { include: { plan: true } },
      _count: { select: { members: true } },
    },
  });

  function formatDate(date: Date): string {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
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
        <h1 className="text-3xl font-bold">Agencies</h1>
        <p className="mt-2 text-muted-foreground">
          Manage all agencies on the platform. {agencies.length} total.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Agencies</CardTitle>
          <CardDescription>
            A list of every registered agency with their plan and member count.
          </CardDescription>
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
              {agencies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No agencies found.
                  </TableCell>
                </TableRow>
              ) : (
                agencies.map((agency) => (
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
