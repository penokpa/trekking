import { get } from "@vercel/blob";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ pathname: string[] }> }
) {
  const { pathname } = await params;
  const blobPathname = pathname.join("/");

  if (!blobPathname) {
    return new NextResponse("Missing pathname", { status: 400 });
  }

  try {
    const result = await get(blobPathname, { access: "private" });

    if (result?.statusCode !== 200) {
      return new NextResponse("Not found", { status: 404 });
    }

    return new NextResponse(result.stream, {
      headers: {
        "Content-Type": result.blob.contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
