import { getAgencyFromHeaders } from "@/lib/tenant";
import { AgencyProvider } from "@/components/shared/agency-provider";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const agency = await getAgencyFromHeaders();

  if (!agency) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Site Not Found</h1>
          <p className="mt-2 text-muted-foreground">
            This agency site could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <AgencyProvider agency={agency}>
      <div className="flex min-h-screen flex-col" data-brand>
        <PublicHeader />
        <main className="flex-1">{children}</main>
        <PublicFooter />
      </div>
    </AgencyProvider>
  );
}
