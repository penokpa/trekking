"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TeamMemberDialog } from "@/components/forms/team-member-dialog";
import { TeamMemberActions } from "@/components/forms/team-member-actions";
import { Plus, UserCircle } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  title: string | null;
  bio: string | null;
  photo: string | null;
  displayOrder: number;
}

interface TeamPageClientProps {
  initialMembers: TeamMember[];
}

export function TeamPageClient({ initialMembers }: TeamPageClientProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  const nextOrder =
    initialMembers.length > 0
      ? Math.max(...initialMembers.map((m) => m.displayOrder)) + 1
      : 1;

  function handleEdit(member: TeamMember) {
    setEditingMember(member);
    setDialogOpen(true);
  }

  function handleCreate() {
    setEditingMember(null);
    setDialogOpen(true);
  }

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4" />
          Add Member
        </Button>
      </div>

      {initialMembers.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">
            No team members yet. Add your first team member.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {initialMembers.map((member) => (
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
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{member.name}</CardTitle>
                      {member.title && (
                        <CardDescription className="mt-1">
                          {member.title}
                        </CardDescription>
                      )}
                    </div>
                    <TeamMemberActions
                      memberId={member.id}
                      memberName={member.name}
                      onEdit={() => handleEdit(member)}
                    />
                  </div>
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

      <TeamMemberDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        member={editingMember}
        nextOrder={nextOrder}
      />
    </>
  );
}
