import { DocsSidebar } from "@/components/docs/DocsSidebar";
import MobileDocsSidebar from "@/components/docs/MobileDocsSidebar";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* Desktop Sidebar */}
      <DocsSidebar />

      <div className="flex flex-1 flex-col">
        {/* Mobile Top Bar */}
        <div className="sticky top-0 z-40 flex items-center gap-2 border-b bg-background px-4 py-3 md:hidden">
          <MobileDocsSidebar />
          <span className="text-sm font-medium">Documentation</span>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 flex-col min-h-0">
          {/* Top bar (mobile / optional) */}
          <div className="sticky top-0 z-40 border-b bg-background px-4 py-3 md:hidden">
            Docs
          </div>

          {/* Scrollable content */}
          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-3xl p-6 md:p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

