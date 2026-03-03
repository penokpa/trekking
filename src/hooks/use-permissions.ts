"use client";

import { useSession } from "next-auth/react";
import type { UserRole } from "@/generated/prisma/client";

export function usePermissions() {
  const { data: session } = useSession();

  const role = session?.user?.role;

  return {
    role,
    isSuperAdmin: role === "SUPER_ADMIN",
    isAgencyAdmin: role === "AGENCY_ADMIN",
    isAgencyStaff: role === "AGENCY_STAFF",
    canManageAgency: role === "AGENCY_ADMIN" || role === "SUPER_ADMIN",
    canEdit:
      role === "AGENCY_ADMIN" ||
      role === "AGENCY_STAFF" ||
      role === "SUPER_ADMIN",
    hasRole: (requiredRole: UserRole) => role === requiredRole,
  };
}
