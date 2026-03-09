import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { blobSrc } from "@/lib/blob";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AddGalleryImageDialog } from "@/components/forms/add-gallery-image-dialog";
import { DeleteGalleryImageButton } from "@/components/forms/delete-gallery-image-button";
import { ImageIcon } from "lucide-react";

export default async function DashboardGalleryPage() {
  const session = await auth();
  const agencyId = session!.user.agencyId!;

  const images = await db.galleryImage.findMany({
    where: { agencyId },
    orderBy: { displayOrder: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gallery</h1>
          <p className="mt-2 text-muted-foreground">Manage your photo gallery.</p>
        </div>
        <AddGalleryImageDialog />
      </div>

      {images.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">No gallery images yet. Upload your first image to get started.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {images.map((image) => (
            <Card key={image.id} className="group relative">
              <CardContent className="p-0">
                <div className="relative aspect-video overflow-hidden rounded-t-xl bg-muted">
                  {image.imageUrl.startsWith("http") || image.imageUrl.startsWith("/api/blob") ? (
                    <img
                      src={blobSrc(image.imageUrl)}
                      alt={image.caption ?? "Gallery image"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <ImageIcon className="h-10 w-10 text-muted-foreground" />
                    </div>
                  )}
                  <DeleteGalleryImageButton imageId={image.id} />
                </div>
              </CardContent>
              <CardHeader className="p-4">
                <CardTitle className="text-sm">
                  {image.caption ?? "Untitled"}
                </CardTitle>
                {image.album && (
                  <CardDescription className="text-xs">
                    Album: {image.album}
                  </CardDescription>
                )}
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
