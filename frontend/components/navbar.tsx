"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b-[2px] border-foreground bg-background/90 backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-4 transition-opacity hover:opacity-80">
          <div className="h-4 w-4 bg-primary" />
          <span className="text-xl font-heading font-black tracking-tight uppercase text-foreground">Grant Toolkit</span>
        </Link>
        <nav className="hidden md:flex gap-8">
          <Link href="#features" className="text-sm font-bold uppercase tracking-widest text-secondary hover:text-primary transition-colors">
            Features
          </Link>
          <Link href="#how-it-works" className="text-sm font-bold uppercase tracking-widest text-secondary hover:text-primary transition-colors">
            Methodology
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/login" className="hidden sm:inline-flex items-center justify-center font-bold uppercase tracking-widest text-xs h-10 px-4 hover:bg-secondary hover:text-secondary-foreground transition-colors">
            Log In
          </Link>
          <Link href="/register" className="inline-flex items-center justify-center bg-foreground text-background hover:bg-primary hover:text-primary-foreground font-bold uppercase tracking-widest text-xs h-10 px-6 transition-colors shadow-[4px_4px_0px_0px_rgba(19,42,27,0.1)] hover:shadow-none">
            Access System
          </Link>
        </div>
      </div>
    </header>
  );
}
