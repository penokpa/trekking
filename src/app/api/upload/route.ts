import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 4 * 1024 * 1024; // 4MB

export async function POST(request: Request): Promise<NextResponse> {
  // Step 1: Check auth
  let session;
  try {
    session = await auth();
  } catch (error) {
    return NextResponse.json(
      { error: `Auth error: ${error instanceof Error ? error.message : "unknown"}` },
      { status: 500 }
    );
  }

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Step 2: Check blob token
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "BLOB_READ_WRITE_TOKEN is not configured" },
      { status: 500 }
    );
  }

  // Step 3: Parse form data
  let formData;
  try {
    formData = await request.formData();
  } catch (error) {
    return NextResponse.json(
      { error: `FormData error: ${error instanceof Error ? error.message : "unknown"}` },
      { status: 400 }
    );
  }

  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: `Invalid file type: ${file.type}` },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "File must be under 4MB" },
      { status: 400 }
    );
  }

  // Step 4: Upload to Vercel Blob
  try {
    const blob = await put(file.name, file, { access: "private", addRandomSuffix: true });
    return NextResponse.json({ url: blob.url });
  } catch (error) {
    return NextResponse.json(
      { error: `Blob upload error: ${error instanceof Error ? error.message : "unknown"}` },
      { status: 500 }
    );
  }
}
