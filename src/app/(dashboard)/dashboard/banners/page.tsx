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
import { BannerActions } from "@/components/forms/banner-actions";
import { Plus } from "lucide-react";

export default async function DashboardBannersPage() {
  const session = await auth();
  const agencyId = session!.user.agencyId!;

  const banners = await db.banner.findMany({
    where: { agencyId },
    orderBy: { startDate: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Banners</h1>
          <p className="mt-2 text-muted-foreground">
            Manage promotional banners.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/banners/new">
            <Plus className="h-4 w-4" />
            Add Banner
          </Link>
        </Button>
      </div>

      {banners.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">
            No banners yet. Create your first banner.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead className="w-16" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {banners.map((banner) => (
                <TableRow key={banner.id}>
                  <TableCell className="font-medium">{banner.title}</TableCell>
                  <TableCell>{banner.location}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={
                        banner.status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {banner.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {banner.startDate
                      ? banner.startDate.toLocaleDateString()
                      : "---"}
                  </TableCell>
                  <TableCell>
                    {banner.endDate
                      ? banner.endDate.toLocaleDateString()
                      : "---"}
                  </TableCell>
                  <TableCell>
                    <BannerActions
                      bannerId={banner.id}
                      bannerTitle={banner.title}
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
