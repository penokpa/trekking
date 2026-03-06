import { db } from "@/lib/db";
import { getAgencyFromHeaders } from "@/lib/tenant";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

export default async function PublicFaqsPage() {
  const agency = await getAgencyFromHeaders();
  if (!agency) return null;

  const faqs = await db.fAQ.findMany({
    where: { agencyId: agency.id },
    orderBy: { displayOrder: "asc" },
  });

  // Group by category
  const categoryMap = new Map<string, typeof faqs>();
  const uncategorized: typeof faqs = [];

  for (const faq of faqs) {
    if (faq.category) {
      const existing = categoryMap.get(faq.category) ?? [];
      existing.push(faq);
      categoryMap.set(faq.category, existing);
    } else {
      uncategorized.push(faq);
    }
  }

  const categories = Array.from(categoryMap.entries());
  const hasCategories = categories.length > 0;

  return (
    <div>
      {/* Gradient banner header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-900 via-orange-900 to-amber-800 py-16 md:py-20">
        <div className="pattern-dots absolute inset-0" />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Frequently Asked Questions
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-amber-100/80">
            Find answers to common questions about our treks, booking process, and
            travel preparation.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-6 py-12 md:py-16">
        {faqs.length === 0 ? (
          <div className="mt-16 text-center">
            <HelpCircle className="mx-auto size-12 text-muted-foreground/40" />
            <p className="mt-4 text-muted-foreground">
              No FAQs available yet. Feel free to contact us with any questions!
            </p>
          </div>
        ) : hasCategories ? (
          <div className="space-y-8">
            {categories.map(([categoryName, categoryFaqs]) => (
              <div
                key={categoryName}
                className="rounded-xl border bg-card p-6 shadow-sm"
              >
                <h2 className="text-xl font-semibold">{categoryName}</h2>
                <Accordion type="multiple" className="mt-4">
                  {categoryFaqs.map((faq) => (
                    <AccordionItem key={faq.id} value={faq.id}>
                      <AccordionTrigger className="text-left hover:no-underline hover:text-primary">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="leading-relaxed text-muted-foreground">
                          {faq.answer}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}

            {uncategorized.length > 0 && (
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h2 className="text-xl font-semibold">Other</h2>
                <Accordion type="multiple" className="mt-4">
                  {uncategorized.map((faq) => (
                    <AccordionItem key={faq.id} value={faq.id}>
                      <AccordionTrigger className="text-left hover:no-underline hover:text-primary">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="leading-relaxed text-muted-foreground">
                          {faq.answer}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <Accordion type="multiple">
              {faqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger className="text-left hover:no-underline hover:text-primary">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="leading-relaxed text-muted-foreground">
                      {faq.answer}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
      </div>
    </div>
  );
}
