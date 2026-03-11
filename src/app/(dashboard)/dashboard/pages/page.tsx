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
import { CustomPageActions } from "@/components/forms/custom-page-actions";
import { Plus } from "lucide-react";

export default async function DashboardCustomPagesPage() {
  const session = await auth();
  const agencyId = session!.user.agencyId!;

  const pages = await db.customPage.findMany({
    where: { agencyId },
    orderBy: { title: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Custom Pages</h1>
          <p className="mt-2 text-muted-foreground">Manage custom pages.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/pages/new">
            <Plus className="h-4 w-4" />
            New Page
          </Link>
        </Button>
      </div>

      {pages.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">
            No custom pages yet. Create your first page.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-16" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages.map((page) => (
                <TableRow key={page.id}>
                  <TableCell className="font-medium">{page.title}</TableCell>
                  <TableCell className="text-muted-foreground">
                    /{page.slug}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={
                        page.status === "PUBLISHED"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {page.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <CustomPageActions
                      pageId={page.id}
                      pageTitle={page.title}
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
