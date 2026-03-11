import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { TestimonialForm } from "@/components/forms/testimonial-form";
import type { TestimonialInput } from "@/lib/validations/testimonial";

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const agencyId = session!.user.agencyId!;

  const testimonial = await db.testimonial.findUnique({
    where: { id },
  });

  if (!testimonial || testimonial.agencyId !== agencyId) {
    notFound();
  }

  const treks = await db.trek.findMany({
    where: { agencyId },
    orderBy: { title: "asc" },
    select: { id: true, title: true },
  });

  const initialData: TestimonialInput & { id: string } = {
    id: testimonial.id,
    clientName: testimonial.clientName,
    country: testimonial.country ?? "",
    trekId: testimonial.trekId ?? "",
    rating: testimonial.rating ?? undefined,
    reviewText: testimonial.reviewText ?? "",
    photo: testimonial.photo ?? "",
    date: testimonial.date.toISOString().split("T")[0],
    featured: testimonial.featured,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Testimonial</h1>
        <p className="mt-2 text-muted-foreground">
          Update testimonial from &quot;{testimonial.clientName}&quot;
        </p>
      </div>
      <TestimonialForm mode="edit" initialData={initialData} treks={treks} />
    </div>
  );
}
