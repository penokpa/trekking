import type { Agency } from "@/generated/prisma/client";

export type AgencyWithBranding = Pick<
  Agency,
  | "id"
  | "name"
  | "slug"
  | "logo"
  | "favicon"
  | "brandColors"
  | "fonts"
  | "contactInfo"
  | "socialLinks"
  | "aboutText"
  | "footerText"
  | "status"
>;

export type NavItem = {
  title: string;
  href: string;
  icon?: string;
  badge?: string;
};
