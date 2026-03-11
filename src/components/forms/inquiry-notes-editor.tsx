"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { updateInquiryNotes } from "@/lib/actions/inquiry";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface InquiryNotesEditorProps {
  inquiryId: string;
  initialNotes: string;
}

export function InquiryNotesEditor({
  inquiryId,
  initialNotes,
}: InquiryNotesEditorProps) {
  const [notes, setNotes] = useState(initialNotes);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      const result = await updateInquiryNotes(inquiryId, notes);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Notes saved");
    });
  }

  return (
    <div className="space-y-2">
      <Textarea
        placeholder="Add internal notes about this inquiry..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={4}
      />
      <Button
        size="sm"
        onClick={handleSave}
        disabled={isPending || notes === initialNotes}
      >
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save Notes
      </Button>
    </div>
  );
}
