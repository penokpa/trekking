import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, UserCircle } from "lucide-react";

export default async function DashboardTeamPage() {
  const session = await auth();
  const agencyId = session!.user.agencyId!;

  const members = await db.teamMember.findMany({
    where: { agencyId },
    orderBy: { displayOrder: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Team</h1>
          <p className="mt-2 text-muted-foreground">Manage team members.</p>
        </div>
        <Button asChild>
          <Link href="#">
            <Plus className="h-4 w-4" />
            Add Member
          </Link>
        </Button>
      </div>

      {members.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">No team members yet. Add your first team member.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <Card key={member.id}>
              <CardContent className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {member.photo ? (
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  ) : (
                    <UserCircle className="h-16 w-16 text-muted-foreground" />
                  )}
                </div>
                <div className="min-w-0">
                  <CardTitle className="text-base">{member.name}</CardTitle>
                  {member.title && (
                    <CardDescription className="mt-1">
                      {member.title}
                    </CardDescription>
                  )}
                  {member.bio && (
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                      {member.bio}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
