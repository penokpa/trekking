import { db } from "@/lib/db";
import { getAgencyFromHeaders } from "@/lib/tenant";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { User } from "lucide-react";

const avatarGradients = [
  "from-emerald-500 to-teal-400",
  "from-blue-500 to-cyan-400",
  "from-violet-500 to-purple-400",
  "from-orange-500 to-amber-400",
  "from-rose-500 to-pink-400",
  "from-indigo-500 to-blue-400",
];

export default async function PublicAboutPage() {
  const agency = await getAgencyFromHeaders();
  if (!agency) return null;

  const teamMembers = await db.teamMember.findMany({
    where: { agencyId: agency.id },
    orderBy: { displayOrder: "asc" },
  });

  return (
    <div>
      {/* Gradient banner header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-800 py-16 md:py-20">
        <div className="pattern-dots absolute inset-0" />
        <div className="relative mx-auto max-w-5xl px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            About Us
          </h1>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6 py-12 md:py-16">
        {agency.aboutText && (
          <div className="mx-auto max-w-3xl">
            {/* Decorative gradient bar */}
            <div className="mb-6 h-1.5 w-24 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400" />
            <p className="whitespace-pre-line text-lg leading-relaxed text-muted-foreground">
              {agency.aboutText}
            </p>
          </div>
        )}

        {/* Team Members */}
        {teamMembers.length > 0 && (
          <div className="mt-16">
            <div className="text-center">
              <h2 className="text-3xl font-bold">Our Team</h2>
              <p className="mt-2 text-muted-foreground">
                Meet the experienced professionals who make your adventures
                unforgettable
              </p>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {teamMembers.map((member, i) => (
                <Card
                  key={member.id}
                  className="group border-0 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <CardHeader>
                    <div
                      className={`mx-auto flex size-24 items-center justify-center rounded-full bg-gradient-to-br ${avatarGradients[i % avatarGradients.length]}`}
                    >
                      <User className="size-10 text-white/70" />
                    </div>
                    <CardTitle className="mt-2">{member.name}</CardTitle>
                    {member.title && (
                      <CardDescription className="text-primary/80">
                        {member.title}
                      </CardDescription>
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
          </div>
        )}
      </div>
    </div>
  );
}
