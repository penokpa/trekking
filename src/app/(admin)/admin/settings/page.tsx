import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Settings, Info } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Platform Settings</h1>
        <p className="mt-2 text-muted-foreground">Manage platform-wide configuration.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Platform Information
          </CardTitle>
          <CardDescription>General information about the trekking platform.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium">Platform Name</p>
              <p className="text-sm text-muted-foreground">Trekking Platform</p>
            </div>
            <div>
              <p className="text-sm font-medium">Version</p>
              <p className="text-sm text-muted-foreground">1.0.0</p>
            </div>
            <div>
              <p className="text-sm font-medium">Environment</p>
              <p className="text-sm text-muted-foreground">
                {process.env.NODE_ENV ?? "development"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Framework</p>
              <p className="text-sm text-muted-foreground">Next.js 16 (App Router)</p>
            </div>
          </div>

          <Separator />

          <div className="flex items-center gap-3 rounded-lg border border-dashed p-4">
            <Settings className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Platform settings coming soon</p>
              <p className="text-sm text-muted-foreground">
                Configuration options for email, notifications, default plans, and
                branding will be available in a future update.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
