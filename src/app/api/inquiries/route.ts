import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAgencyFromHeaders } from "@/lib/tenant";
import { inquirySchema } from "@/lib/validations/inquiry";

export async function POST(req: Request) {
  try {
    const agency = await getAgencyFromHeaders();
    if (!agency) {
      return NextResponse.json(
        { message: "Agency not found" },
        { status: 400 }
      );
    }

    const body = await req.json();

    // Coerce groupSize from string to number if present
    if (body.groupSize !== undefined && body.groupSize !== "") {
      body.groupSize = Number(body.groupSize);
    } else {
      delete body.groupSize;
    }

    const parsed = inquirySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid input", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const inquiry = await db.inquiry.create({
      data: {
        agencyId: agency.id,
        ...parsed.data,
      },
    });

    return NextResponse.json(
      { message: "Inquiry submitted successfully", inquiryId: inquiry.id },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
