import { getAgencyFromHeaders } from "@/lib/tenant";
import { AgencyHomePage } from "@/components/public/agency-homepage";

export default async function PublicHomePage() {
  const agency = await getAgencyFromHeaders();
  if (!agency) return null;

  return <AgencyHomePage agencyId={agency.id} agencyName={agency.name} />;
}
