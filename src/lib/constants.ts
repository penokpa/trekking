import type { NavItem } from "@/types";

export const dashboardNavItems: NavItem[] = [
  { title: "Overview", href: "/dashboard", icon: "LayoutDashboard" },
  { title: "Treks", href: "/dashboard/treks", icon: "Mountain" },
  { title: "Blog", href: "/dashboard/blog", icon: "FileText" },
  { title: "Gallery", href: "/dashboard/gallery", icon: "Image" },
  { title: "Team", href: "/dashboard/team", icon: "Users" },
  { title: "FAQs", href: "/dashboard/faqs", icon: "HelpCircle" },
  { title: "Testimonials", href: "/dashboard/testimonials", icon: "Star" },
  { title: "Pages", href: "/dashboard/pages", icon: "File" },
  { title: "Banners", href: "/dashboard/banners", icon: "Flag" },
  { title: "Inquiries", href: "/dashboard/inquiries", icon: "MessageSquare" },
  { title: "Analytics", href: "/dashboard/analytics", icon: "BarChart3" },
  { title: "Settings", href: "/dashboard/settings", icon: "Settings" },
];

export const adminNavItems: NavItem[] = [
  { title: "Dashboard", href: "/admin/dashboard", icon: "LayoutDashboard" },
  { title: "Agencies", href: "/admin/agencies", icon: "Building2" },
  { title: "Plans", href: "/admin/plans", icon: "CreditCard" },
  { title: "Analytics", href: "/admin/analytics", icon: "BarChart3" },
  { title: "Settings", href: "/admin/settings", icon: "Settings" },
];

export const publicNavItems: NavItem[] = [
  { title: "Home", href: "/" },
  { title: "Treks", href: "/treks" },
  { title: "About", href: "/about" },
  { title: "Blog", href: "/blog" },
  { title: "Gallery", href: "/gallery" },
  { title: "Contact", href: "/contact" },
  { title: "FAQs", href: "/faqs" },
];

export const DEFAULT_BRAND_COLORS = {
  primary: "222.2 84% 4.9%",
  secondary: "210 40% 96.1%",
  accent: "210 40% 96.1%",
};
