import { getAgencyFromHeaders } from "@/lib/tenant";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, MapPin } from "lucide-react";
import { InquiryForm } from "@/components/forms/inquiry-form";

export default async function PublicContactPage() {
  const agency = await getAgencyFromHeaders();
  if (!agency) return null;

  const contactInfo = agency.contactInfo as Record<string, string> | null;

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 md:py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">Contact Us</h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Have questions about our treks or want to plan a custom adventure?
          We&apos;d love to hear from you.
        </p>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-3">
        {/* Contact Info */}
        <div className="space-y-6 lg:col-span-1">
          {contactInfo?.email && (
            <Card>
              <CardHeader className="pb-0">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Mail className="size-5 text-primary" />
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
            <Card>
              <CardHeader className="pb-0">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Phone className="size-5 text-primary" />
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
            <Card>
              <CardHeader className="pb-0">
                <CardTitle className="flex items-center gap-2 text-base">
                  <MapPin className="size-5 text-primary" />
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
          <Card>
            <CardHeader>
              <CardTitle>Send Us an Inquiry</CardTitle>
            </CardHeader>
            <CardContent>
              <InquiryForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
