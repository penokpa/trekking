"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AgencyInfoForm } from "@/components/forms/agency-info-form";
import { ContactInfoForm } from "@/components/forms/contact-info-form";
import { SocialLinksForm } from "@/components/forms/social-links-form";
import { BrandColorsForm } from "@/components/forms/brand-colors-form";
import { Pencil } from "lucide-react";

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

interface SubscriptionData {
  status: string;
  plan: { name: string; price: number; interval: string };
  currentPeriodStart: string;
  currentPeriodEnd: string;
}

interface SettingsClientProps {
  agency: {
    name: string;
    slug: string;
    status: string;
    customDomain: string | null;
    aboutText: string | null;
    footerText: string | null;
  };
  contactInfo: ContactInfo;
  socialLinks: SocialLinks;
  brandColors: BrandColors;
  subscription: SubscriptionData | null;
}

type EditSection = "info" | "contact" | "social" | "brand" | null;

const statusColor: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-800",
  SUSPENDED: "bg-red-100 text-red-800",
  PENDING: "bg-yellow-100 text-yellow-800",
};

export function SettingsClient({
  agency,
  contactInfo,
  socialLinks,
  brandColors,
  subscription,
}: SettingsClientProps) {
  const [editing, setEditing] = useState<EditSection>(null);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your agency settings and branding.
        </p>
      </div>

      {/* Agency Info */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Agency Information</CardTitle>
            <CardDescription>Basic details about your agency</CardDescription>
          </div>
          {editing !== "info" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditing("info")}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {editing === "info" ? (
            <AgencyInfoForm
              initialData={{
                name: agency.name,
                aboutText: agency.aboutText ?? "",
                footerText: agency.footerText ?? "",
              }}
              onCancel={() => setEditing(null)}
            />
          ) : (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Name
                  </p>
                  <p className="text-base">{agency.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Slug
                  </p>
                  <p className="font-mono text-base">{agency.slug}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Status
                  </p>
                  <Badge
                    variant="secondary"
                    className={
                      statusColor[agency.status] ??
                      "bg-gray-100 text-gray-800"
                    }
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
              {agency.aboutText && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    About
                  </p>
                  <p className="text-sm">{agency.aboutText}</p>
                </div>
              )}
              {agency.footerText && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Footer Text
                  </p>
                  <p className="text-sm">{agency.footerText}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>How customers can reach you</CardDescription>
          </div>
          {editing !== "contact" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditing("contact")}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {editing === "contact" ? (
            <ContactInfoForm
              initialData={contactInfo}
              onCancel={() => setEditing(null)}
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Email
                </p>
                <p className="text-base">{contactInfo.email ?? "---"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Phone
                </p>
                <p className="text-base">{contactInfo.phone ?? "---"}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Address
                </p>
                <p className="text-base">
                  {[
                    contactInfo.address,
                    contactInfo.city,
                    contactInfo.country,
                  ]
                    .filter(Boolean)
                    .join(", ") || "---"}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Social Links</CardTitle>
            <CardDescription>Your social media profiles</CardDescription>
          </div>
          {editing !== "social" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditing("social")}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {editing === "social" ? (
            <SocialLinksForm
              initialData={socialLinks}
              onCancel={() => setEditing(null)}
            />
          ) : Object.entries(socialLinks).filter(([, v]) => v).length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No social links configured.
            </p>
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
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Brand Colors</CardTitle>
            <CardDescription>Your agency brand colors</CardDescription>
          </div>
          {editing !== "brand" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditing("brand")}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {editing === "brand" ? (
            <BrandColorsForm
              initialData={brandColors}
              onCancel={() => setEditing(null)}
            />
          ) : Object.entries(brandColors).filter(([, v]) => v).length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No brand colors configured.
            </p>
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

      {/* Subscription (read-only) */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>Your current plan</CardDescription>
        </CardHeader>
        <CardContent>
          {subscription ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Plan
                </p>
                <p className="text-base">{subscription.plan.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Status
                </p>
                <Badge
                  variant="secondary"
                  className={
                    subscription.status === "ACTIVE"
                      ? "bg-green-100 text-green-800"
                      : subscription.status === "PAST_DUE"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                  }
                >
                  {subscription.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Price
                </p>
                <p className="text-base">
                  ${subscription.plan.price.toFixed(2)} /{" "}
                  {subscription.plan.interval.toLowerCase()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Current Period
                </p>
                <p className="text-base">
                  {new Date(
                    subscription.currentPeriodStart
                  ).toLocaleDateString()}{" "}
                  &ndash;{" "}
                  {new Date(
                    subscription.currentPeriodEnd
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No active subscription.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
