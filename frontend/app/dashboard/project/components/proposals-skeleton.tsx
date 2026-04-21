import React from "react";

export function ProposalsSkeleton() {
  return (
    <div className="flex flex-col gap-4 animate-pulse mt-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="border-[2px] border-foreground/20 bg-muted/50 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4 w-full">
            <div className="w-12 h-12 border-[2px] border-foreground/10 bg-foreground/5 shrink-0" />
            <div className="w-full max-w-lg space-y-3">
              <div className="h-3 w-32 bg-foreground/10" />
              <div className="h-6 w-full bg-foreground/10" />
              <div className="h-4 w-64 bg-foreground/10" />
            </div>
          </div>
          <div className="h-10 w-32 bg-foreground/10 shrink-0" />
        </div>
      ))}
    </div>
  );
}
