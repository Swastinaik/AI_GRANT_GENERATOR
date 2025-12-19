"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { SVGProps } from "react";

// Utility for merging tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Footer = () => (
  <footer className="py-12 bg-background border-t border-border">
    <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex items-center gap-2 font-bold text-lg">
        <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
          <FileText className="text-primary-foreground w-3 h-3" />
        </div>
        <span>GrantAI</span>
      </div>
      <p className="text-sm text-muted-foreground">
        © {new Date().getFullYear()} GrantAI for Non-Profits. All rights reserved.
      </p>
      <div className="flex gap-6 text-sm text-muted-foreground">
        <Link href="#" className="hover:text-foreground">Privacy</Link>
        <Link href="#" className="hover:text-foreground">Terms</Link>
        <Link href="#" className="hover:text-foreground">Twitter</Link>
      </div>
    </div>
  </footer>
);

export default Footer