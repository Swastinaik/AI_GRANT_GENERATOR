"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NavigationMenuComponent from "../NavigationMenu";
import { AgentsNavigation } from "@/app/constants/constants";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Zap,
  LayoutTemplate,
  Star,
  ChevronDown,
  Menu
} from "lucide-react";
import Link from "next/link";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { AuthButton } from "../AuthButton";

// Utility for merging tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const NavBar = () => (
  <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <FileText className="text-primary-foreground w-5 h-5" />
        </div>
        <span>GrantAI</span>
      </Link>
      <div className="hidden md:flex gap-6 items-center text-sm font-medium text-muted-foreground">
        <NavigationMenuComponent components={AgentsNavigation} />
        <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
        <Link href="#reviews" className="hover:text-foreground transition-colors">Reviews</Link>
        <Link href="#faq" className="hover:text-foreground transition-colors">FAQ</Link>
      </div>
      <div className="flex gap-4">
        <AuthButton />
      </div>
    </div>
  </nav>
);

export default NavBar