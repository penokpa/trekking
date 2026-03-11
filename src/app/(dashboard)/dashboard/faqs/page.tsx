import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { FaqManager } from "@/components/forms/faq-manager";

export default async function DashboardFaqsPage() {
  const session = await auth();
  const agencyId = session!.user.agencyId!;

  const faqs = await db.fAQ.findMany({
    where: { agencyId },
    orderBy: { displayOrder: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">FAQs</h1>
        <p className="mt-2 text-muted-foreground">
          Manage frequently asked questions.
        </p>
      </div>
      <FaqManager initialFaqs={faqs} />
    </div>
  );
}
