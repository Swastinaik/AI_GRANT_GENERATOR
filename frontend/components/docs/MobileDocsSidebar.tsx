"use client";

import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DocsSidebarContent } from "./DocsSidebarContent";

export default function MobileDocsSidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          aria-label="Open docs navigation"
          className="md:hidden inline-flex items-center justify-center rounded-lg border bg-card p-2 hover:bg-accent"
        >
          <Menu className="h-5 w-5" />
        </button>
      </SheetTrigger>

      <SheetContent side="left" className="w-64 bg-sidebar p-4">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Agents
        </h2>

        <DocsSidebarContent />
      </SheetContent>
    </Sheet>
  );
}
