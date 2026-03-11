import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { CustomPageForm } from "@/components/forms/custom-page-form";
import type { CustomPageInput } from "@/lib/validations/custom-page";

export default async function EditCustomPagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const agencyId = session!.user.agencyId!;

  const page = await db.customPage.findUnique({
    where: { id },
  });

  if (!page || page.agencyId !== agencyId) {
    notFound();
  }

  const seoMeta = (page.seoMeta as Record<string, string>) ?? {};

  const initialData: CustomPageInput & { id: string } = {
    id: page.id,
    title: page.title,
    slug: page.slug,
    body: page.body ?? "",
    status: page.status as CustomPageInput["status"],
    seoMeta: {
      metaTitle: seoMeta.metaTitle ?? "",
      metaDescription: seoMeta.metaDescription ?? "",
      ogImage: seoMeta.ogImage ?? "",
    },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Page</h1>
        <p className="mt-2 text-muted-foreground">
          Update &quot;{page.title}&quot;
        </p>
      </div>
      <CustomPageForm mode="edit" initialData={initialData} />
    </div>
  );
}
