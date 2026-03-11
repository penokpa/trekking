import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InquiryStatusSelect } from "@/components/forms/inquiry-status-select";
import { InquiryNotesEditor } from "@/components/forms/inquiry-notes-editor";
import { ArrowLeft, Mail, Phone, Globe, Users, Calendar, Mountain } from "lucide-react";

interface InquiryDetailPageProps {
  params: Promise<{ id: string }>;
}

const statusColor: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-800",
  READ: "bg-yellow-100 text-yellow-800",
  REPLIED: "bg-green-100 text-green-800",
  ARCHIVED: "bg-gray-100 text-gray-800",
};

export default async function InquiryDetailPage({
  params,
}: InquiryDetailPageProps) {
  const { id } = await params;
  const session = await auth();
  const agencyId = session!.user.agencyId!;

  const inquiry = await db.inquiry.findUnique({
    where: { id },
    include: { trek: { select: { title: true } } },
  });

  if (!inquiry || inquiry.agencyId !== agencyId) {
    notFound();
  }

  // Auto-mark as read (direct DB update — no revalidatePath during render)
  if (inquiry.status === "NEW") {
    await db.inquiry.update({
      where: { id: inquiry.id },
      data: { status: "READ" },
    });
  }
  const displayStatus = inquiry.status === "NEW" ? "READ" : inquiry.status;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/inquiries">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{inquiry.name}</h1>
          <p className="text-muted-foreground">
            Received {inquiry.createdAt.toLocaleDateString()} at{" "}
            {inquiry.createdAt.toLocaleTimeString()}
          </p>
        </div>
        <Badge variant="secondary" className={statusColor[displayStatus]}>
          {displayStatus}
        </Badge>
        <InquiryStatusSelect
          inquiryId={inquiry.id}
          currentStatus={displayStatus as typeof inquiry.status}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <a href={`mailto:${inquiry.email}`} className="text-primary hover:underline">
                {inquiry.email}
              </a>
            </div>
            {inquiry.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{inquiry.phone}</span>
              </div>
            )}
            {inquiry.country && (
              <div className="flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span>{inquiry.country}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Trip Details */}
        <Card>
          <CardHeader>
            <CardTitle>Trip Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {inquiry.trek && (
              <div className="flex items-center gap-2 text-sm">
                <Mountain className="h-4 w-4 text-muted-foreground" />
                <span>{inquiry.trek.title}</span>
              </div>
            )}
            {inquiry.travelDates && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{inquiry.travelDates}</span>
              </div>
            )}
            {inquiry.groupSize && (
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{inquiry.groupSize} {inquiry.groupSize === 1 ? "person" : "people"}</span>
              </div>
            )}
            {!inquiry.trek && !inquiry.travelDates && !inquiry.groupSize && (
              <p className="text-sm text-muted-foreground">No trip details provided.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Message */}
      <Card>
        <CardHeader>
          <CardTitle>Message</CardTitle>
        </CardHeader>
        <CardContent>
          {inquiry.message ? (
            <p className="whitespace-pre-wrap text-sm">{inquiry.message}</p>
          ) : (
            <p className="text-sm text-muted-foreground">No message provided.</p>
          )}
        </CardContent>
      </Card>

      {/* Admin Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Notes</CardTitle>
          <CardDescription>
            Internal notes — not visible to the customer.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InquiryNotesEditor
            inquiryId={inquiry.id}
            initialNotes={inquiry.adminNotes ?? ""}
          />
        </CardContent>
      </Card>
    </div>
  );
}
