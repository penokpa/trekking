"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createTeamMember,
  updateTeamMember,
} from "@/lib/actions/team";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ImageUpload } from "@/components/forms/image-upload";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  title: string | null;
  bio: string | null;
  photo: string | null;
  displayOrder: number;
}

interface TeamMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member?: TeamMember | null;
  nextOrder: number;
}

export function TeamMemberDialog({
  open,
  onOpenChange,
  member,
  nextOrder,
}: TeamMemberDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState(member?.name ?? "");
  const [title, setTitle] = useState(member?.title ?? "");
  const [bio, setBio] = useState(member?.bio ?? "");
  const [photo, setPhoto] = useState<string | null>(member?.photo ?? null);
  const [displayOrder, setDisplayOrder] = useState(
    member?.displayOrder ?? nextOrder
  );

  // Reset form when dialog opens with different member
  function resetForm(m?: TeamMember | null) {
    setName(m?.name ?? "");
    setTitle(m?.title ?? "");
    setBio(m?.bio ?? "");
    setPhoto(m?.photo ?? null);
    setDisplayOrder(m?.displayOrder ?? nextOrder);
  }

  function handleSave() {
    if (!name.trim()) return;

    startTransition(async () => {
      const input = {
        name: name.trim(),
        title: title.trim() || undefined,
        bio: bio.trim() || undefined,
        photo: photo || undefined,
        displayOrder,
      };

      const result = member
        ? await updateTeamMember(member.id, input)
        : await createTeamMember(input);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success(member ? "Team member updated" : "Team member added");
      onOpenChange(false);
      router.refresh();
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (o && !member) resetForm();
        onOpenChange(o);
      }}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {member ? "Edit Team Member" : "Add Team Member"}
          </DialogTitle>
          <DialogDescription>
            {member
              ? "Update team member details."
              : "Add a new team member to your agency."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Photo</label>
            <ImageUpload
              value={photo}
              onChange={(url) => setPhoto(url ?? null)}
              disabled={isPending}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Name *</label>
            <Input
              placeholder="e.g., Ramesh Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Title</label>
            <Input
              placeholder="e.g., Senior Trek Guide"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isPending}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Bio</label>
            <Textarea
              placeholder="A short bio..."
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              disabled={isPending}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Display Order</label>
            <Input
              type="number"
              min={0}
              value={displayOrder}
              onChange={(e) => setDisplayOrder(Number(e.target.value))}
              disabled={isPending}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isPending || !name.trim()}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {member ? "Save Changes" : "Add Member"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
