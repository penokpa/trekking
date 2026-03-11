import Link from "next/link";
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
import { InquiryActions } from "@/components/forms/inquiry-actions";
import { InquiryFilters } from "./inquiry-filters";
import type { InquiryStatus } from "@/generated/prisma/client";

interface Props {
  searchParams: Promise<{ status?: string }>;
}

const statusColor: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-800",
  READ: "bg-yellow-100 text-yellow-800",
  REPLIED: "bg-green-100 text-green-800",
  ARCHIVED: "bg-gray-100 text-gray-800",
};

const validStatuses: InquiryStatus[] = ["NEW", "READ", "REPLIED", "ARCHIVED"];

export default async function DashboardInquiriesPage({ searchParams }: Props) {
  const { status } = await searchParams;
  const session = await auth();
  const agencyId = session!.user.agencyId!;

  const statusFilter =
    status && validStatuses.includes(status as InquiryStatus)
      ? (status as InquiryStatus)
      : undefined;

  // Fetch inquiries + counts in parallel
  const [inquiries, newCount, readCount, repliedCount, archivedCount, allCount] =
    await Promise.all([
      db.inquiry.findMany({
        where: { agencyId, ...(statusFilter ? { status: statusFilter } : {}) },
        orderBy: { createdAt: "desc" },
        include: { trek: { select: { title: true } } },
      }),
      db.inquiry.count({ where: { agencyId, status: "NEW" } }),
      db.inquiry.count({ where: { agencyId, status: "READ" } }),
      db.inquiry.count({ where: { agencyId, status: "REPLIED" } }),
      db.inquiry.count({ where: { agencyId, status: "ARCHIVED" } }),
      db.inquiry.count({ where: { agencyId } }),
    ]);

  const counts = {
    ALL: allCount,
    NEW: newCount,
    READ: readCount,
    REPLIED: repliedCount,
    ARCHIVED: archivedCount,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Inquiries</h1>
        <p className="mt-2 text-muted-foreground">
          View and manage customer inquiries.
        </p>
      </div>

      <InquiryFilters counts={counts} />

      {inquiries.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">
            {statusFilter
              ? `No ${statusFilter.toLowerCase()} inquiries.`
              : "No inquiries yet."}
          </p>
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
                <TableHead className="w-[50px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {inquiries.map((inquiry) => (
                <TableRow key={inquiry.id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/dashboard/inquiries/${inquiry.id}`}
                      className="hover:underline"
                    >
                      {inquiry.name}
                    </Link>
                  </TableCell>
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
                  <TableCell>
                    {inquiry.createdAt.toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <InquiryActions
                      inquiryId={inquiry.id}
                      inquiryName={inquiry.name}
                      currentStatus={inquiry.status}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
