import { TrekForm } from "@/components/forms/trek-form";

export default function NewTrekPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create Trek</h1>
        <p className="mt-2 text-muted-foreground">
          Add a new trek package to your catalog.
        </p>
      </div>
      <TrekForm mode="create" />
    </div>
  );
}
