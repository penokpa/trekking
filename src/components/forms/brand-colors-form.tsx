"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  brandColorsSchema,
  type BrandColorsInput,
} from "@/lib/validations/agency";
import { updateBrandColors } from "@/lib/actions/agency";
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

interface BrandColorsFormProps {
  initialData: BrandColorsInput;
  onCancel: () => void;
}

const colorFields = [
  { name: "primary" as const, label: "Primary" },
  { name: "secondary" as const, label: "Secondary" },
  { name: "accent" as const, label: "Accent" },
];

export function BrandColorsForm({
  initialData,
  onCancel,
}: BrandColorsFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<BrandColorsInput>({
    resolver: zodResolver(brandColorsSchema),
    defaultValues: {
      primary: initialData.primary ?? "",
      secondary: initialData.secondary ?? "",
      accent: initialData.accent ?? "",
    },
  });

  function onSubmit(data: BrandColorsInput) {
    startTransition(async () => {
      const result = await updateBrandColors(data);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Brand colors updated");
      onCancel();
      router.refresh();
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          {colorFields.map((cf) => (
            <FormField
              key={cf.name}
              control={form.control}
              name={cf.name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{cf.label}</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input placeholder="#1a2b3c" {...field} />
                    </FormControl>
                    {field.value && /^#[0-9a-fA-F]{6}$/.test(field.value) && (
                      <div
                        className="h-9 w-9 shrink-0 rounded-md border"
                        style={{ backgroundColor: field.value }}
                      />
                    )}
                  </div>
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
