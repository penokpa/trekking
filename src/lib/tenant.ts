import { cache } from "react";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import type { AgencyWithBranding } from "@/types";

const agencySelect = {
  id: true,
  name: true,
  slug: true,
  logo: true,
  favicon: true,
  brandColors: true,
  fonts: true,
  contactInfo: true,
  socialLinks: true,
  aboutText: true,
  footerText: true,
  status: true,
} as const;

export const getAgencyBySlug = cache(
  async (slug: string): Promise<AgencyWithBranding | null> => {
    return db.agency.findUnique({
      where: { slug, status: "ACTIVE" },
      select: agencySelect,
    });
  }
);

export const getAgencyByDomain = cache(
  async (domain: string): Promise<AgencyWithBranding | null> => {
    return db.agency.findUnique({
      where: { customDomain: domain, status: "ACTIVE" },
      select: agencySelect,
    });
  }
);

export async function getAgencyFromHeaders(): Promise<AgencyWithBranding | null> {
  const headersList = await headers();
  const slug = headersList.get("x-agency-slug");
  const domain = headersList.get("x-agency-domain");

  if (slug) return getAgencyBySlug(slug);
  if (domain) return getAgencyByDomain(domain);
  return null;
}
