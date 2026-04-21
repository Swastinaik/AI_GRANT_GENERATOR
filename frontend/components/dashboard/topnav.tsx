"use client";

import { Menu, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TopNav() {
  return (
    <header className="h-16 border-b-[2px] border-foreground bg-background/90 backdrop-blur-md flex items-center justify-between px-4 sm:px-8 shrink-0 relative z-20">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="md:hidden rounded-none border-[2px] border-transparent hover:border-foreground transition-colors">
          <Menu className="h-5 w-5" />
        </Button>
        <span className="font-heading font-black text-xl tracking-tight hidden sm:block text-foreground">
          Workspace
        </span>
      </div>

      <div className="flex items-center gap-6">
        {/* User limits visualizer */}
        <div className="hidden sm:flex items-center gap-3 bg-muted border-[2px] border-foreground px-4 py-1.5 shadow-[4px_4px_0px_0px_rgba(19,42,27,1)]">
          <Zap className="h-4 w-4 text-primary" strokeWidth={2.5} />
          <div className="flex flex-col">
            <div className="flex items-center justify-between gap-4 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-foreground">Generation Quota</span>
              <span className="text-[10px] font-bold text-foreground">3 / 5</span>
            </div>
            <div className="h-2 w-32 bg-background border-[1px] border-foreground">
              <div className="h-full bg-primary" style={{ width: "60%" }} />
            </div>
          </div>
        </div>

        <Button className="rounded-none bg-primary text-primary-foreground hover:bg-foreground hover:text-background font-bold uppercase tracking-widest text-xs h-9 px-4 transition-colors">
          Upgrade Capacity
        </Button>
      </div>
    </header>
  );
}
