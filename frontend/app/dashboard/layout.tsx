import { Sidebar } from "@/components/dashboard/sidebar";
import { TopNav } from "@/components/dashboard/topnav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground">
      <Sidebar />
      <div className="flex-1 flex flex-col relative h-screen overflow-hidden">
        {/* Subtle grid pattern for the dashboard background */}
        <div className="absolute inset-0 opacity-[0.15] pointer-events-none z-0" style={{
            backgroundImage: "linear-gradient(to right, #132A1B 1px, transparent 1px), linear-gradient(to bottom, #132A1B 1px, transparent 1px)",
            backgroundSize: "40px 40px"
        }} />
        <TopNav />
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
}
