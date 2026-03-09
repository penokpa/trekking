/**
 * Converts a private Vercel Blob URL to a proxy URL for rendering.
 * Private blob URLs are not publicly accessible, so we serve them
 * through /api/blob/[...pathname] which authenticates with the token.
 *
 * DB stores the original blob URL (for deletion via `del()`).
 * Rendering uses the proxy URL (for public display).
 */
export function blobSrc(url: string): string {
  if (!url) return url;

  // Extract pathname from private or public blob URLs
  const match = url.match(
    /https?:\/\/[^/]+\.(?:private|public)\.blob\.vercel-storage\.com\/(.+)/
  );
  if (match) {
    return `/api/blob/${match[1]}`;
  }

  return url;
}
