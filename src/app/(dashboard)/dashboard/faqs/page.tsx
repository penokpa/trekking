import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
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

export default async function DashboardFaqsPage() {
  const session = await auth();
  const agencyId = session!.user.agencyId!;

  const faqs = await db.fAQ.findMany({
    where: { agencyId },
    orderBy: { displayOrder: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">FAQs</h1>
          <p className="mt-2 text-muted-foreground">
            Manage frequently asked questions.
          </p>
        </div>
        <Button asChild>
          <Link href="#">
            <Plus className="h-4 w-4" />
            Add FAQ
          </Link>
        </Button>
      </div>

      {faqs.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">No FAQs yet. Add your first FAQ.</p>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50%]">Question</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Display Order</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {faqs.map((faq) => (
                <TableRow key={faq.id}>
                  <TableCell className="font-medium">
                    {faq.question.length > 80
                      ? `${faq.question.slice(0, 80)}...`
                      : faq.question}
                  </TableCell>
                  <TableCell>{faq.category ?? "---"}</TableCell>
                  <TableCell>{faq.displayOrder}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
