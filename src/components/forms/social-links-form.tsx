"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  socialLinksSchema,
  type SocialLinksInput,
} from "@/lib/validations/agency";
import { updateSocialLinks } from "@/lib/actions/agency";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface SocialLinksFormProps {
  initialData: SocialLinksInput;
  onCancel: () => void;
}

const socialFields = [
  { name: "facebook" as const, label: "Facebook" },
  { name: "instagram" as const, label: "Instagram" },
  { name: "twitter" as const, label: "Twitter / X" },
  { name: "youtube" as const, label: "YouTube" },
  { name: "linkedin" as const, label: "LinkedIn" },
  { name: "tiktok" as const, label: "TikTok" },
];

export function SocialLinksForm({
  initialData,
  onCancel,
}: SocialLinksFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<SocialLinksInput>({
    resolver: zodResolver(socialLinksSchema),
    defaultValues: {
      facebook: initialData.facebook ?? "",
      instagram: initialData.instagram ?? "",
      twitter: initialData.twitter ?? "",
      youtube: initialData.youtube ?? "",
      linkedin: initialData.linkedin ?? "",
      tiktok: initialData.tiktok ?? "",
    },
  });

  function onSubmit(data: SocialLinksInput) {
    startTransition(async () => {
      const result = await updateSocialLinks(data);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Social links updated");
      onCancel();
      router.refresh();
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {socialFields.map((sf) => (
            <FormField
              key={sf.name}
              control={form.control}
              name={sf.name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{sf.label}</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
