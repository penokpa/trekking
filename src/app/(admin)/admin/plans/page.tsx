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

export default async function AdminPlansPage() {
  const plans = await db.plan.findMany({
    orderBy: { price: "asc" },
    include: {
      _count: { select: { subscriptions: true } },
    },
  });

  function formatPrice(price: number, interval: string): string {
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
    return `${formatted}/${interval === "MONTHLY" ? "mo" : "yr"}`;
  }

  function formatFeatures(features: unknown): string {
    if (!features) return "-";
    if (Array.isArray(features)) {
      return features.join(", ");
    }
    return "-";
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Plans</h1>
        <p className="mt-2 text-muted-foreground">
          Manage subscription plans. {plans.length} total.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Plans</CardTitle>
          <CardDescription>
            Subscription plans available on the platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Interval</TableHead>
                <TableHead>Active</TableHead>
                <TableHead className="text-right">Subscribers</TableHead>
                <TableHead>Features</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No plans found.
                  </TableCell>
                </TableRow>
              ) : (
                plans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-medium">{plan.name}</TableCell>
                    <TableCell className="text-muted-foreground">{plan.slug}</TableCell>
                    <TableCell>{formatPrice(plan.price, plan.interval)}</TableCell>
                    <TableCell>{plan.interval}</TableCell>
                    <TableCell>
                      <Badge variant={plan.isActive ? "default" : "secondary"}>
                        {plan.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{plan._count.subscriptions}</TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground">
                      {formatFeatures(plan.features)}
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
