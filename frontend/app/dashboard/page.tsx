import { Suspense } from "react";
import { Plus, Search } from "lucide-react";
import { RecentHistory, RecentHistorySkeleton } from "@/components/dashboard/recent-history";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-12 pb-12">

      {/* Top Welcome / Actions Section */}
      <section className="flex flex-col md:flex-row gap-8 items-start md:items-end justify-between border-b-[2px] border-foreground pb-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">System Ready</span>
            <div className="h-[2px] w-8 bg-primary" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-heading font-black leading-tight text-foreground mb-4">
            Intelligence <span className="italic font-light text-primary">Hub.</span>
          </h1>
          <p className="text-secondary font-sans leading-relaxed text-lg">
            Deploy analytical tools, establish new foundational narratives, or retrieve secured historical records.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto shrink-0 mt-4 md:mt-0">
          <Link href="/dashboard/search" className="group flex items-center justify-between gap-6 bg-background border-[2px] border-foreground px-6 py-4 transition-all hover:bg-secondary hover:text-secondary-foreground shadow-[6px_6px_0px_0px_rgba(19,42,27,1)] active:shadow-none active:translate-x-[6px] active:translate-y-[6px]">
            <div className="flex flex-col items-start gap-1">
              <span className="text-xs font-bold uppercase tracking-widest text-primary group-hover:text-primary transition-colors">Action 01</span>
              <span className="font-heading font-black text-xl">Search Grants</span>
            </div>
            <div className="w-10 h-10 border-[2px] border-foreground rounded-full flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-colors">
              <Search className="h-5 w-5" />
            </div>
          </Link>

          <Link href={'/dashboard/project/new'} className="group flex items-center justify-between gap-6 bg-primary text-primary-foreground border-[2px] border-foreground px-6 py-4 transition-all hover:bg-foreground hover:text-background shadow-[6px_6px_0px_0px_rgba(19,42,27,1)] active:shadow-none active:translate-x-[6px] active:translate-y-[6px]">
            <div className="flex flex-col items-start gap-1">
              <span className="text-xs font-bold uppercase tracking-widest text-background/70">Action 02</span>
              <span className="font-heading font-black text-xl">Create Project</span>
            </div>
            <div className="w-10 h-10 border-[2px] border-background rounded-full flex items-center justify-center bg-background text-foreground transition-colors group-hover:border-foreground">
              <Plus className="h-6 w-6" />
            </div>
          </Link>
        </div>
      </section>

      {/* Main Grid Content */}
      <div className="grid lg:grid-cols-3 gap-12">
        {/* Left Col: Recent History (Takes up 2 cols on large screen) */}
        <section className="lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-heading font-black uppercase tracking-wide">Recent Extractions</h2>
            <button className="text-xs font-bold uppercase tracking-widest text-secondary hover:text-primary underline decoration-2 underline-offset-4 transition-colors">
              View Complete Ledger
            </button>
          </div>
          {/*
            
          

          <Suspense fallback={<RecentHistorySkeleton />}>
            <RecentHistory />
          </Suspense>
          */}
        </section>

        {/* Right Col: Auxiliary Info */}
        <aside className="flex flex-col gap-8">
          <div className="border-[2px] border-foreground p-6 bg-background relative overflow-hidden group">
            <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors" />

            <h3 className="text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-primary inline-block" /> Prompt Library
            </h3>
            <p className="text-secondary text-sm mb-6 leading-relaxed">
              Access the validated repository of generative templates parameterized for Federal RFPs.
            </p>
            <button className="text-xs font-bold uppercase tracking-widest text-primary group-hover:text-foreground transition-colors flex items-center gap-2">
              Access Library &rarr;
            </button>
          </div>

          <div className="border-[2px] border-foreground p-6 bg-secondary text-secondary-foreground">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-primary inline-block" /> System Status
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-secondary-foreground/70">Engine</span>
                <span className="font-bold text-primary">v0.9.1-beta</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-secondary-foreground/70">Vector DB</span>
                <span className="font-bold text-background">Operational</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-secondary-foreground/70">LLM Node</span>
                <span className="font-bold text-background">Operational</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

    </div>
  );
}
