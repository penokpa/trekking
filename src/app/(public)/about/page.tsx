import { db } from "@/lib/db";
import { getAgencyFromHeaders } from "@/lib/tenant";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User } from "lucide-react";

export default async function PublicAboutPage() {
  const agency = await getAgencyFromHeaders();
  if (!agency) return null;

  const teamMembers = await db.teamMember.findMany({
    where: { agencyId: agency.id },
    orderBy: { displayOrder: "asc" },
  });

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 md:py-16">
      {/* About Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">About Us</h1>
      </div>

      {agency.aboutText && (
        <div className="mx-auto mt-8 max-w-3xl">
          <p className="whitespace-pre-line text-lg leading-relaxed text-muted-foreground">
            {agency.aboutText}
          </p>
        </div>
      )}

      {/* Team Members */}
      {teamMembers.length > 0 && (
        <>
          <Separator className="my-12" />
          <div className="text-center">
            <h2 className="text-3xl font-bold">Our Team</h2>
            <p className="mt-2 text-muted-foreground">
              Meet the experienced professionals who make your adventures
              unforgettable
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member) => (
              <Card key={member.id} className="text-center">
                <CardHeader>
                  <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-muted">
                    <User className="size-10 text-muted-foreground/50" />
                  </div>
                  <CardTitle className="mt-2">{member.name}</CardTitle>
                  {member.title && (
                    <CardDescription>{member.title}</CardDescription>
                  )}
                </CardHeader>
                {member.bio && (
                  <CardContent>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {member.bio}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
