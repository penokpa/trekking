/**
 * Converts a private Vercel Blob URL to a proxy URL for rendering.
 * Public blob URLs are returned as-is (they're directly accessible via CDN).
 * Private blob URLs go through /api/blob/[...pathname] which authenticates server-side.
 */
export function blobSrc(url: string): string {
  if (!url) return url;

  // Private blob URLs need proxying
  const match = url.match(
    /https?:\/\/[^/]+\.private\.blob\.vercel-storage\.com\/(.+)/
  );
  if (match) {
    return `/api/blob/${match[1]}`;
  }

  // Public blob URLs and other URLs are directly accessible
  return url;
}
