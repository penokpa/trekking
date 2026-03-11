import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { TeamPageClient } from "./team-page-client";

export default async function DashboardTeamPage() {
  const session = await auth();
  const agencyId = session!.user.agencyId!;

  const members = await db.teamMember.findMany({
    where: { agencyId },
    orderBy: { displayOrder: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Team</h1>
        <p className="mt-2 text-muted-foreground">Manage team members.</p>
      </div>
      <TeamPageClient initialMembers={members} />
    </div>
  );
}
