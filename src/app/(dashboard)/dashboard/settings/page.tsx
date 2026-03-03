import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ContactInfo {
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
}

interface SocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  linkedin?: string;
  tiktok?: string;
}

interface BrandColors {
  primary?: string;
  secondary?: string;
  accent?: string;
}

export default async function DashboardSettingsPage() {
  const session = await auth();
  const agencyId = session!.user.agencyId!;

  const agency = await db.agency.findUniqueOrThrow({
    where: { id: agencyId },
    include: {
      subscription: {
        include: { plan: true },
      },
    },
  });

  const contactInfo = (agency.contactInfo as ContactInfo | null) ?? {};
  const socialLinks = (agency.socialLinks as SocialLinks | null) ?? {};
  const brandColors = (agency.brandColors as BrandColors | null) ?? {};

  const statusColor: Record<string, string> = {
    ACTIVE: "bg-green-100 text-green-800",
    SUSPENDED: "bg-red-100 text-red-800",
    PENDING: "bg-yellow-100 text-yellow-800",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="mt-2 text-muted-foreground">
          Manage agency settings. Edit forms coming soon.
        </p>
      </div>

      {/* Agency Info */}
      <Card>
        <CardHeader>
          <CardTitle>Agency Information</CardTitle>
          <CardDescription>Basic details about your agency</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p className="text-base">{agency.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Slug</p>
              <p className="font-mono text-base">{agency.slug}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <Badge
                variant="secondary"
                className={statusColor[agency.status] ?? "bg-gray-100 text-gray-800"}
              >
                {agency.status}
              </Badge>
            </div>
            {agency.customDomain && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Custom Domain
                </p>
                <p className="text-base">{agency.customDomain}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>How customers can reach you</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-base">{contactInfo.email ?? "---"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Phone</p>
              <p className="text-base">{contactInfo.phone ?? "---"}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-sm font-medium text-muted-foreground">Address</p>
              <p className="text-base">
                {[contactInfo.address, contactInfo.city, contactInfo.country]
                  .filter(Boolean)
                  .join(", ") || "---"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <CardTitle>Social Links</CardTitle>
          <CardDescription>Your social media profiles</CardDescription>
        </CardHeader>
        <CardContent>
          {Object.entries(socialLinks).filter(([, v]) => v).length === 0 ? (
            <p className="text-sm text-muted-foreground">No social links configured.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {Object.entries(socialLinks)
                .filter(([, v]) => v)
                .map(([platform, url]) => (
                  <div key={platform}>
                    <p className="text-sm font-medium capitalize text-muted-foreground">
                      {platform}
                    </p>
                    <p className="truncate text-base">{url}</p>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Brand Colors */}
      <Card>
        <CardHeader>
          <CardTitle>Brand Colors</CardTitle>
          <CardDescription>Your agency brand colors</CardDescription>
        </CardHeader>
        <CardContent>
          {Object.entries(brandColors).filter(([, v]) => v).length === 0 ? (
            <p className="text-sm text-muted-foreground">No brand colors configured.</p>
          ) : (
            <div className="flex flex-wrap gap-6">
              {Object.entries(brandColors)
                .filter(([, v]) => v)
                .map(([name, color]) => (
                  <div key={name} className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-lg border shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                    <div>
                      <p className="text-sm font-medium capitalize">{name}</p>
                      <p className="font-mono text-xs text-muted-foreground">
                        {color}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Subscription */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>Your current plan</CardDescription>
        </CardHeader>
        <CardContent>
          {agency.subscription ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Plan</p>
                <p className="text-base">{agency.subscription.plan.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge
                  variant="secondary"
                  className={
                    agency.subscription.status === "ACTIVE"
                      ? "bg-green-100 text-green-800"
                      : agency.subscription.status === "PAST_DUE"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                  }
                >
                  {agency.subscription.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Price
                </p>
                <p className="text-base">
                  ${agency.subscription.plan.price.toFixed(2)} /{" "}
                  {agency.subscription.plan.interval.toLowerCase()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Current Period
                </p>
                <p className="text-base">
                  {agency.subscription.currentPeriodStart.toLocaleDateString()} &ndash;{" "}
                  {agency.subscription.currentPeriodEnd.toLocaleDateString()}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No active subscription.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
