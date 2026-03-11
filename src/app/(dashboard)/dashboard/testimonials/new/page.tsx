import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { TestimonialForm } from "@/components/forms/testimonial-form";

export default async function NewTestimonialPage() {
  const session = await auth();
  const agencyId = session!.user.agencyId!;

  const treks = await db.trek.findMany({
    where: { agencyId },
    orderBy: { title: "asc" },
    select: { id: true, title: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add Testimonial</h1>
        <p className="mt-2 text-muted-foreground">
          Add a new client testimonial.
        </p>
      </div>
      <TestimonialForm mode="create" treks={treks} />
    </div>
  );
}
