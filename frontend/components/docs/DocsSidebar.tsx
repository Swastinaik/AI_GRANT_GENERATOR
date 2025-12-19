import Link from "next/link";
import { agentsDocs } from "@/app/lib/docs/agents";
import { DocsSidebarContent } from "./DocsSidebarContent";

export function DocsSidebar() {
  return (
    <aside className="w-64 border-r bg-sidebar p-4 min-h-screen overflow-y-hidden  hidden md:flex flex-col">
      <h2 className="mb-4 text-sm font-semibold text-muted-foreground">
        Agents
      </h2>

      <DocsSidebarContent/>
    </aside>
  );
}
