import { CustomPageForm } from "@/components/forms/custom-page-form";

export default function NewCustomPagePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create Page</h1>
        <p className="mt-2 text-muted-foreground">
          Create a new custom page for your site.
        </p>
      </div>
      <CustomPageForm mode="create" />
    </div>
  );
}
