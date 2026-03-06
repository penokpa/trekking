import { getAgencyFromHeaders } from "@/lib/tenant";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";
import { InquiryForm } from "@/components/forms/inquiry-form";

export default async function PublicContactPage({
  searchParams,
}: {
  searchParams: Promise<{ trek?: string }>;
}) {
  const { trek: trekId } = await searchParams;
  const agency = await getAgencyFromHeaders();
  if (!agency) return null;

  const contactInfo = agency.contactInfo as Record<string, string> | null;

  return (
    <div>
      {/* Gradient banner header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-cyan-900 via-teal-900 to-cyan-800 py-16 md:py-20">
        <div className="pattern-dots absolute inset-0" />
        <div className="relative mx-auto max-w-5xl px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Contact Us
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-cyan-100/80">
            Have questions about our treks or want to plan a custom adventure?
            We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6 py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Contact Info */}
          <div className="space-y-6 lg:col-span-1">
            {contactInfo?.email && (
              <Card className="border-0 shadow-sm transition-shadow hover:shadow-md">
                <CardHeader className="pb-0">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
                      <Mail className="size-5 text-primary" />
                    </div>
                    Email
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                  >
                    {contactInfo.email}
                  </a>
                </CardContent>
              </Card>
            )}

            {contactInfo?.phone && (
              <Card className="border-0 shadow-sm transition-shadow hover:shadow-md">
                <CardHeader className="pb-0">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
                      <Phone className="size-5 text-primary" />
                    </div>
                    Phone
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <a
                    href={`tel:${contactInfo.phone}`}
                    className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                  >
                    {contactInfo.phone}
                  </a>
                </CardContent>
              </Card>
            )}

            {contactInfo?.address && (
              <Card className="border-0 shadow-sm transition-shadow hover:shadow-md">
                <CardHeader className="pb-0">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
                      <MapPin className="size-5 text-primary" />
                    </div>
                    Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {contactInfo.address}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Inquiry Form */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden border-0 shadow-lg">
              {/* Gradient accent strip */}
              <div className="h-1.5 bg-gradient-to-r from-cyan-500 to-teal-400" />
              <CardHeader>
                <CardTitle>Send Us an Inquiry</CardTitle>
              </CardHeader>
              <CardContent>
                <InquiryForm trekId={trekId} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
