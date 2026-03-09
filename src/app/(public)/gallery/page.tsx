import { db } from "@/lib/db";
import { getAgencyFromHeaders } from "@/lib/tenant";
import { blobSrc } from "@/lib/blob";
import { GradientPlaceholder } from "@/components/shared/gradient-placeholder";
import { ImageIcon } from "lucide-react";

function GalleryImage({
  image,
  index,
}: {
  image: { id: string; imageUrl: string; caption: string | null };
  index: number;
}) {
  const hasRealImage = image.imageUrl.startsWith("http") || image.imageUrl.startsWith("/api/blob");

  return (
    <div className="group relative mb-4 break-inside-avoid overflow-hidden rounded-xl shadow-sm transition-shadow hover:shadow-xl">
      {hasRealImage ? (
        <img
          src={blobSrc(image.imageUrl)}
          alt={image.caption ?? "Gallery image"}
          className="aspect-[4/3] w-full object-cover"
        />
      ) : (
        <GradientPlaceholder index={index} className="aspect-[4/3]">
          <ImageIcon className="size-10 text-white/30" />
        </GradientPlaceholder>
      )}
      {image.caption && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent px-3 py-3 pt-8 text-sm text-white opacity-0 transition-opacity group-hover:opacity-100">
          {image.caption}
        </div>
      )}
    </div>
  );
}

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
    <div>
      {/* Gradient banner header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-violet-900 to-purple-800 py-16 md:py-20">
        <div className="pattern-dots absolute inset-0" />
        <div className="relative mx-auto max-w-6xl px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Gallery
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-purple-100/80">
            A visual journey through the mountains, trails, and experiences we
            share with our trekkers.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        {images.length === 0 ? (
          <div className="mt-16 text-center">
            <ImageIcon className="mx-auto size-12 text-muted-foreground/40" />
            <p className="mt-4 text-muted-foreground">
              No gallery images yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Albums */}
            {albums.map(([albumName, albumImages]) => (
              <div key={albumName}>
                <h2 className="mb-1 text-2xl font-semibold">{albumName}</h2>
                <div className="mb-6 h-1 w-16 rounded-full bg-gradient-to-r from-purple-500 to-violet-400" />
                <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
                  {albumImages.map((image, i) => (
                    <GalleryImage key={image.id} image={image} index={i} />
                  ))}
                </div>
              </div>
            ))}

            {/* Ungrouped images */}
            {ungrouped.length > 0 && (
              <div>
                {albums.length > 0 && (
                  <>
                    <h2 className="mb-1 text-2xl font-semibold">
                      Other Photos
                    </h2>
                    <div className="mb-6 h-1 w-16 rounded-full bg-gradient-to-r from-purple-500 to-violet-400" />
                  </>
                )}
                <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
                  {ungrouped.map((image, i) => (
                    <GalleryImage key={image.id} image={image} index={i + 3} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
