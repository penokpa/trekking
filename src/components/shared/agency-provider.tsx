"use client";

import { createContext } from "react";
import type { AgencyWithBranding } from "@/types";

export const AgencyContext = createContext<AgencyWithBranding | null>(null);

export function AgencyProvider({
  agency,
  children,
}: {
  agency: AgencyWithBranding;
  children: React.ReactNode;
}) {
  const brandColors = agency.brandColors as Record<string, string> | null;

  return (
    <AgencyContext.Provider value={agency}>
      <div
        style={
          brandColors
            ? ({
                "--brand-primary": brandColors.primary,
                "--brand-primary-foreground": brandColors.primaryForeground,
                "--brand-accent": brandColors.accent,
              } as React.CSSProperties)
            : undefined
        }
      >
        {children}
      </div>
    </AgencyContext.Provider>
  );
}
