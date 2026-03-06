import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { TrekForm } from "@/components/forms/trek-form";
import type { TrekInput } from "@/lib/validations/trek";
import type { UploadedImage } from "@/components/forms/image-upload";

export default async function EditTrekPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const agencyId = session!.user.agencyId!;

  const trek = await db.trek.findUnique({
    where: { id },
    include: { images: { orderBy: { displayOrder: "asc" } } },
  });

  if (!trek || trek.agencyId !== agencyId) {
    notFound();
  }

  const initialData: TrekInput & { id: string } = {
    id: trek.id,
    title: trek.title,
    slug: trek.slug,
    summary: trek.summary ?? "",
    description: trek.description ?? "",
    duration: trek.duration ?? undefined,
    difficulty: trek.difficulty as TrekInput["difficulty"],
    maxAltitude: trek.maxAltitude ?? undefined,
    groupSize: trek.groupSize ?? undefined,
    priceFrom: trek.priceFrom ?? undefined,
    itinerary: (trek.itinerary as TrekInput["itinerary"]) ?? [],
    includes: (trek.includes as string[]) ?? [],
    excludes: (trek.excludes as string[]) ?? [],
    coverImage: trek.coverImage ?? "",
    status: trek.status as TrekInput["status"],
    featured: trek.featured,
    region: trek.region ?? "",
    bestSeason: trek.bestSeason ?? "",
  };

  const initialImages: UploadedImage[] = trek.images.map((img) => ({
    id: img.id,
    imageUrl: img.imageUrl,
    caption: img.caption ?? "",
    displayOrder: img.displayOrder,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Trek</h1>
        <p className="mt-2 text-muted-foreground">
          Update &quot;{trek.title}&quot;
        </p>
      </div>
      <TrekForm
        mode="edit"
        initialData={initialData}
        initialImages={initialImages}
      />
    </div>
  );
}
