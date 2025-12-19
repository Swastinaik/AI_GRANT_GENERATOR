import { DocsSidebar } from "./DocsSidebar";

export function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full">
      <DocsSidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="mx-auto max-w-3xl">{children}</div>
      </main>
    </div>
  );
}
