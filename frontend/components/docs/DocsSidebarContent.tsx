import Link from "next/link";
import { agentsDocs } from "@/app/lib/docs/agents";

export function DocsSidebarContent({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  return (
    <nav className="space-y-1">
      {agentsDocs.map((agent) => (
        <Link
          key={agent.slug}
          href={`/docs/agents/${agent.slug}`}
          onClick={onNavigate}
          className="flex items-center justify-start gap-2 rounded-lg px-3 py-2 text-sm transition hover:bg-sidebar-accent"
        >
          {agent.icon}
          {agent.name}
        </Link>
      ))}
    </nav>
  );
}
