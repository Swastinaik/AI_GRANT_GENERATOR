'use client';

import Link from 'next/link';
import GrantCard from './GrantCard';
import { GrantType } from '@/app/lib/utils/types';
import { ArrowLeft, SearchX } from 'lucide-react';

export default function GrantsGrid({ grants }: { grants: GrantType[] }) {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">

      {/* Unified Top Navigation */}
      <nav className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
          <div className="text-sm font-medium text-muted-foreground">
            {grants.length} {grants.length === 1 ? 'Result' : 'Results'} Found
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Available Grants
          </h1>
          <p className="text-muted-foreground text-lg">
            Review the matches based on your project description and domain.
          </p>
        </div>

        {grants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in duration-700">
            {grants.map((grant) => (
              <GrantCard key={grant.id} grant={grant} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500 border-2 border-dashed border-border rounded-2xl bg-muted/10">
            <SearchX className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No grants found</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              We couldn't find any grants matching your exact criteria at the moment. Try refining your search.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}