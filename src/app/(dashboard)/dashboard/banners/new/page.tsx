import { BannerForm } from "@/components/forms/banner-form";

export default function NewBannerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create Banner</h1>
        <p className="mt-2 text-muted-foreground">
          Add a new promotional banner.
        </p>
      </div>
      <BannerForm mode="create" />
    </div>
  );
}
