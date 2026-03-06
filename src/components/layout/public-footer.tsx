"use client";

import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { publicNavItems } from "@/lib/constants";
import { useAgency } from "@/hooks/use-agency";

const socialIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
};

export function PublicFooter({ className }: { className?: string }) {
  const agency = useAgency();

  const socialLinks = (agency.socialLinks as Record<string, string>) ?? {};
  const contactInfo = (agency.contactInfo as Record<string, string>) ?? {};

  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={cn(
        "bg-gradient-to-b from-muted/30 to-muted/60",
        className
      )}
    >
      {/* Gradient top line */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Agency info */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">
              {agency?.name ?? "Trekking"}
            </h3>
            {agency?.aboutText && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {agency.aboutText}
              </p>
            )}
          </div>

          {/* Navigation links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Quick Links</h4>
            <nav className="flex flex-col space-y-2">
              {publicNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact info */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Contact</h4>
            <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
              {contactInfo.email && (
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="flex items-center gap-2 transition-colors hover:text-foreground"
                >
                  <Mail className="size-4 shrink-0" />
                  {contactInfo.email}
                </a>
              )}
              {contactInfo.phone && (
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="flex items-center gap-2 transition-colors hover:text-foreground"
                >
                  <Phone className="size-4 shrink-0" />
                  {contactInfo.phone}
                </a>
              )}
              {contactInfo.address && (
                <span className="flex items-center gap-2">
                  <MapPin className="size-4 shrink-0" />
                  {contactInfo.address}
                </span>
              )}
            </div>
          </div>

          {/* Social links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Follow Us</h4>
            <div className="flex items-center gap-3">
              {Object.entries(socialLinks).map(([platform, url]) => {
                if (!url) return null;
                const Icon = socialIconMap[platform.toLowerCase()];
                if (!Icon) return null;

                return (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={`Follow us on ${platform}`}
                  >
                    <Icon className="size-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Gradient separator */}
        <div className="my-8 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-xs text-muted-foreground">
            {agency?.footerText ??
              `\u00A9 ${currentYear} ${agency?.name ?? "Trekking"}. All rights reserved.`}
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
