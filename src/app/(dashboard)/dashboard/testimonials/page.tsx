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
import { Plus, Star } from "lucide-react";

export default async function DashboardTestimonialsPage() {
  const session = await auth();
  const agencyId = session!.user.agencyId!;

  const testimonials = await db.testimonial.findMany({
    where: { agencyId },
    orderBy: { date: "desc" },
    include: { trek: { select: { title: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Testimonials</h1>
          <p className="mt-2 text-muted-foreground">
            Manage client testimonials.
          </p>
        </div>
        <Button asChild>
          <Link href="#">
            <Plus className="h-4 w-4" />
            Add Testimonial
          </Link>
        </Button>
      </div>

      {testimonials.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">No testimonials yet. Add your first testimonial.</p>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client Name</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Trek</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testimonials.map((testimonial) => (
                <TableRow key={testimonial.id}>
                  <TableCell className="font-medium">
                    {testimonial.clientName}
                  </TableCell>
                  <TableCell>{testimonial.country ?? "---"}</TableCell>
                  <TableCell>{testimonial.trek?.title ?? "---"}</TableCell>
                  <TableCell>
                    {testimonial.rating != null ? (
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < testimonial.rating!
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    ) : (
                      "---"
                    )}
                  </TableCell>
                  <TableCell>
                    {testimonial.featured ? (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800"
                      >
                        Featured
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">---</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {testimonial.date.toLocaleDateString()}
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
