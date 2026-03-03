import { UserRole } from "@/generated/prisma/client";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role: UserRole;
    agencyId?: string;
  }

  interface Session {
    user: {
      id: string;
      role: UserRole;
      agencyId?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    agencyId?: string;
  }
}
