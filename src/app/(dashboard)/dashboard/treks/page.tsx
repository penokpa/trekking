import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";

export default async function DashboardTreksPage() {
  const session = await auth();
  const agencyId = session!.user.agencyId!;

  const treks = await db.trek.findMany({
    where: { agencyId },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Treks</h1>
          <p className="mt-2 text-muted-foreground">Manage your trek packages.</p>
        </div>
        <Button asChild>
          <Link href="#">
            <Plus className="h-4 w-4" />
            Add Trek
          </Link>
        </Button>
      </div>

      {treks.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">No treks yet. Create your first trek to get started.</p>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {treks.map((trek) => (
                <TableRow key={trek.id}>
                  <TableCell className="font-medium">{trek.title}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={
                        trek.status === "PUBLISHED"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {trek.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{trek.difficulty ?? "---"}</TableCell>
                  <TableCell>
                    {trek.duration ? `${trek.duration} days` : "---"}
                  </TableCell>
                  <TableCell>
                    {trek.priceFrom != null ? `$${trek.priceFrom.toFixed(0)}` : "---"}
                  </TableCell>
                  <TableCell>{trek.updatedAt.toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
