"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createFaq, updateFaq, deleteFaq } from "@/lib/actions/faq";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";

interface Faq {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  displayOrder: number;
}

interface FaqManagerProps {
  initialFaqs: Faq[];
}

export function FaqManager({ initialFaqs }: FaqManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [faqs, setFaqs] = useState<Faq[]>(initialFaqs);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form state
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);

  function openCreate() {
    setEditingFaq(null);
    setQuestion("");
    setAnswer("");
    setCategory("");
    setDisplayOrder(
      faqs.length > 0 ? Math.max(...faqs.map((f) => f.displayOrder)) + 1 : 1
    );
    setDialogOpen(true);
  }

  function openEdit(faq: Faq) {
    setEditingFaq(faq);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setCategory(faq.category ?? "");
    setDisplayOrder(faq.displayOrder);
    setDialogOpen(true);
  }

  function handleSave() {
    if (!question.trim() || !answer.trim()) return;

    startTransition(async () => {
      const input = {
        question: question.trim(),
        answer: answer.trim(),
        category: category.trim() || undefined,
        displayOrder,
      };

      if (editingFaq) {
        const result = await updateFaq(editingFaq.id, input);
        if (!result.success) {
          toast.error(result.error);
          return;
        }
        toast.success("FAQ updated");
        setFaqs((prev) =>
          prev.map((f) =>
            f.id === editingFaq.id
              ? { ...f, ...input, category: input.category ?? null }
              : f
          )
        );
      } else {
        const result = await createFaq(input);
        if (!result.success) {
          toast.error(result.error);
          return;
        }
        toast.success("FAQ created");
        setFaqs((prev) => [
          ...prev,
          {
            id: result.faqId,
            ...input,
            category: input.category ?? null,
          },
        ]);
      }

      setDialogOpen(false);
      router.refresh();
    });
  }

  function handleDelete(faqId: string) {
    startTransition(async () => {
      const result = await deleteFaq(faqId);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("FAQ deleted");
      setFaqs((prev) => prev.filter((f) => f.id !== faqId));
      setDeleteId(null);
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Add FAQ
        </Button>
      </div>

      {faqs.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">
            No FAQs yet. Add your first FAQ.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50%]">Question</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Order</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {faqs
                .sort((a, b) => a.displayOrder - b.displayOrder)
                .map((faq) => (
                  <TableRow key={faq.id}>
                    <TableCell className="font-medium">
                      {faq.question.length > 80
                        ? `${faq.question.slice(0, 80)}...`
                        : faq.question}
                    </TableCell>
                    <TableCell>{faq.category ?? "---"}</TableCell>
                    <TableCell>{faq.displayOrder}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openEdit(faq)}
                          disabled={isPending}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => setDeleteId(faq.id)}
                          disabled={isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingFaq ? "Edit FAQ" : "Add FAQ"}</DialogTitle>
            <DialogDescription>
              {editingFaq
                ? "Update the question and answer."
                : "Add a new frequently asked question."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Question *</label>
              <Input
                placeholder="e.g., What should I pack for the trek?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                disabled={isPending}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Answer *</label>
              <Textarea
                placeholder="Write the answer here..."
                rows={4}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={isPending}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">Category</label>
                <Input
                  placeholder="e.g., General, Safety"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
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
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isPending || !question.trim() || !answer.trim()}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingFaq ? "Save Changes" : "Add FAQ"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete FAQ</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this FAQ? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteId && handleDelete(deleteId)}
              disabled={isPending}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
