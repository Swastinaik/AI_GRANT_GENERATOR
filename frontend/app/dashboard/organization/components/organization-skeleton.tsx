import React from "react";

export function OrganizationSkeleton() {
  return (
    <div className="max-w-4xl mx-auto pb-12 animate-pulse mt-8">
      <div className="mb-8 border-b-[2px] border-foreground pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="w-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[2px] w-8 bg-primary/30" />
            <div className="h-3 w-24 bg-foreground/10" />
          </div>
          <div className="h-12 w-3/4 bg-foreground/10 mb-4" />
          <div className="h-4 w-1/2 bg-foreground/10" />
        </div>
        <div className="shrink-0 w-16 h-16 border-[2px] border-foreground/20 bg-foreground/10" />
      </div>

      <div className="space-y-12">
        <div className="border-[2px] border-foreground/20 bg-background p-6 lg:p-8">
          <div className="h-6 w-48 bg-foreground/10 mb-6" />
          <div className="h-14 w-full border-[2px] border-foreground/20 bg-foreground/5" />
        </div>

        <div className="border-[2px] border-foreground/20 bg-secondary/10 p-6 lg:p-8">
          <div className="h-6 w-64 bg-foreground/10 mb-6" />
          <div className="grid grid-cols-1 gap-10">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex flex-col gap-3">
                <div className="h-4 w-48 bg-foreground/10" />
                <div className="h-32 w-full border-[2px] border-foreground/20 bg-foreground/5" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
