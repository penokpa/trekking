import { db } from "@/lib/db";
import { getAgencyFromHeaders } from "@/lib/tenant";
import { ImageIcon } from "lucide-react";

export default async function PublicGalleryPage() {
  const agency = await getAgencyFromHeaders();
  if (!agency) return null;

  const images = await db.galleryImage.findMany({
    where: { agencyId: agency.id },
    orderBy: { displayOrder: "asc" },
  });

  // Group by album
  const albumMap = new Map<string, typeof images>();
  const ungrouped: typeof images = [];

  for (const image of images) {
    if (image.album) {
      const existing = albumMap.get(image.album) ?? [];
      existing.push(image);
      albumMap.set(image.album, existing);
    } else {
      ungrouped.push(image);
    }
  }

  const albums = Array.from(albumMap.entries());

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">Gallery</h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          A visual journey through the mountains, trails, and experiences we
          share with our trekkers.
        </p>
      </div>

      {images.length === 0 ? (
        <div className="mt-16 text-center">
          <ImageIcon className="mx-auto size-12 text-muted-foreground/40" />
          <p className="mt-4 text-muted-foreground">
            No gallery images yet. Check back soon!
          </p>
        </div>
      ) : (
        <div className="mt-10 space-y-12">
          {/* Albums */}
          {albums.map(([albumName, albumImages]) => (
            <div key={albumName}>
              <h2 className="mb-6 text-2xl font-semibold">{albumName}</h2>
              <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
                {albumImages.map((image) => (
                  <div
                    key={image.id}
                    className="group relative mb-4 break-inside-avoid overflow-hidden rounded-lg bg-muted"
                  >
                    <div className="flex aspect-[4/3] items-center justify-center">
                      <ImageIcon className="size-10 text-muted-foreground/40" />
                    </div>
                    {image.caption && (
                      <div className="absolute inset-x-0 bottom-0 bg-black/60 px-3 py-2 text-sm text-white opacity-0 transition-opacity group-hover:opacity-100">
                        {image.caption}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Ungrouped images */}
          {ungrouped.length > 0 && (
            <div>
              {albums.length > 0 && (
                <h2 className="mb-6 text-2xl font-semibold">Other Photos</h2>
              )}
              <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
                {ungrouped.map((image) => (
                  <div
                    key={image.id}
                    className="group relative mb-4 break-inside-avoid overflow-hidden rounded-lg bg-muted"
                  >
                    <div className="flex aspect-[4/3] items-center justify-center">
                      <ImageIcon className="size-10 text-muted-foreground/40" />
                    </div>
                    {image.caption && (
                      <div className="absolute inset-x-0 bottom-0 bg-black/60 px-3 py-2 text-sm text-white opacity-0 transition-opacity group-hover:opacity-100">
                        {image.caption}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
