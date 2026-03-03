export default async function CustomPage({ params }: { params: Promise<{ pageSlug: string }> }) {
  const { pageSlug } = await params;
  return (
    <div>
      <h1 className="text-3xl font-bold">{pageSlug}</h1>
      <p className="mt-2 text-muted-foreground">Custom page details.</p>
    </div>
  );
}
