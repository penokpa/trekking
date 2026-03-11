import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { BannerForm } from "@/components/forms/banner-form";
import type { BannerInput } from "@/lib/validations/banner";

export default async function EditBannerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const agencyId = session!.user.agencyId!;

  const banner = await db.banner.findUnique({
    where: { id },
  });

  if (!banner || banner.agencyId !== agencyId) {
    notFound();
  }

  const initialData: BannerInput & { id: string } = {
    id: banner.id,
    title: banner.title,
    subtitle: banner.subtitle ?? "",
    ctaText: banner.ctaText ?? "",
    ctaLink: banner.ctaLink ?? "",
    backgroundImage: banner.backgroundImage ?? "",
    startDate: banner.startDate
      ? banner.startDate.toISOString().split("T")[0]
      : "",
    endDate: banner.endDate
      ? banner.endDate.toISOString().split("T")[0]
      : "",
    location: banner.location as BannerInput["location"],
    status: banner.status as BannerInput["status"],
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Banner</h1>
        <p className="mt-2 text-muted-foreground">
          Update &quot;{banner.title}&quot;
        </p>
      </div>
      <BannerForm mode="edit" initialData={initialData} />
    </div>
  );
}
