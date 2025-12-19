import { notFound } from "next/navigation";
import { agentsDocs } from "@/app/lib/docs/agents";
import { DocsSection } from "@/components/docs/DocsSection";

export default async function AgentDocsPage({
  params,
}: {
  params: Promise<{ agent: string }>;
}) {
  const { agent } = await params
  const agentDocs = agentsDocs.find((a) => a.slug === agent);

  if (!agent) return notFound();

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">{agentDocs?.name}</h1>
        <p className="text-muted-foreground">{agentDocs?.description}</p>
      </header>

      {agentDocs?.sections.map((section) => (
        <DocsSection key={section.id} title={section.title}>
          {section.content}
        </DocsSection>
      ))}
    </div>
  );
}
