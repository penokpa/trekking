import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { SettingsClient } from "./settings-client";

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

  return (
    <SettingsClient
      agency={{
        name: agency.name,
        slug: agency.slug,
        status: agency.status,
        customDomain: agency.customDomain,
        aboutText: agency.aboutText,
        footerText: agency.footerText,
      }}
      contactInfo={contactInfo}
      socialLinks={socialLinks}
      brandColors={brandColors}
      subscription={
        agency.subscription
          ? {
              status: agency.subscription.status,
              plan: {
                name: agency.subscription.plan.name,
                price: agency.subscription.plan.price,
                interval: agency.subscription.plan.interval,
              },
              currentPeriodStart:
                agency.subscription.currentPeriodStart.toISOString(),
              currentPeriodEnd:
                agency.subscription.currentPeriodEnd.toISOString(),
            }
          : null
      }
    />
  );
}
