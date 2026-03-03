import { Fragment } from "react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function DashboardInquiriesPage() {
  const session = await auth();
  const agencyId = session!.user.agencyId!;

  const inquiries = await db.inquiry.findMany({
    where: { agencyId },
    orderBy: { createdAt: "desc" },
    include: { trek: { select: { title: true } } },
  });

  const statusColor: Record<string, string> = {
    NEW: "bg-blue-100 text-blue-800",
    READ: "bg-yellow-100 text-yellow-800",
    REPLIED: "bg-green-100 text-green-800",
    ARCHIVED: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Inquiries</h1>
        <p className="mt-2 text-muted-foreground">
          View and manage customer inquiries.
        </p>
      </div>

      {inquiries.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">No inquiries yet.</p>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Trek</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inquiries.map((inquiry) => (
                <Fragment key={inquiry.id}>
                  <TableRow>
                    <TableCell className="font-medium">{inquiry.name}</TableCell>
                    <TableCell>{inquiry.email}</TableCell>
                    <TableCell>{inquiry.trek?.title ?? "---"}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={statusColor[inquiry.status]}
                      >
                        {inquiry.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{inquiry.createdAt.toLocaleDateString()}</TableCell>
                  </TableRow>
                  {inquiry.message && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="bg-muted/30 py-2 text-sm text-muted-foreground"
                      >
                        {inquiry.message.length > 200
                          ? `${inquiry.message.slice(0, 200)}...`
                          : inquiry.message}
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
