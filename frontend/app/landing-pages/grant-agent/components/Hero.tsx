"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
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

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility for merging tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Hero = () => {
  return (
    <section className="relative pt-10 pb-32 md:pb-48 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-6"
          >
            <div className="inline-flex items-center rounded-full border border-border px-3 py-1 text-sm font-medium text-muted-foreground w-fit bg-secondary/50">
              <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
              Now supporting Multi-Section Generation
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
              Turn Organization Data into <span className="text-primary">Winning Grants</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-[500px]">
              Stop struggling with writer's block. Upload your organization's history and let our AI agents generate context-aware, parallel-processed grant proposals in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <button className="h-12 px-8 rounded-lg bg-primary text-primary-foreground font-medium text-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                <Link href={'/generate-grant'} className="flex gap-2 items-center">
                  Start Writing Free <ArrowRight className="w-4 h-4" />
                </Link>
              </button>
              <button className="h-12 px-8 rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground font-medium text-lg transition-colors">
                <Link href={'/generate-grant'}>
                  View Demo
                </Link>

              </button>
            </div>
          </motion.div>

          {/* Right Image/Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl border border-border bg-card shadow-2xl overflow-hidden aspect-[4/3] lg:aspect-square">
              {/* Abstract UI Representation */}
              <div className="absolute inset-0 bg-gradient-to-br from-secondary to-background p-8 flex flex-col gap-4">
                {/* Mock Header */}
                <div className="h-8 w-1/3 bg-muted rounded-md animate-pulse mb-4 opacity-50"></div>

                {/* Mock Sections being generated */}
                <div className="space-y-4">
                  <div className="p-4 bg-background rounded-xl border border-border shadow-sm flex items-center gap-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600">
                      <Zap size={20} />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="h-2 w-20 bg-muted rounded animate-pulse"></div>
                      <div className="h-2 w-full bg-muted/50 rounded animate-pulse"></div>
                    </div>
                    <div className="text-xs text-green-600 font-medium bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">Done</div>
                  </div>

                  <div className="p-4 bg-background rounded-xl border border-border shadow-sm flex items-center gap-4">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600">
                      <LayoutTemplate size={20} />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="h-2 w-24 bg-muted rounded animate-pulse"></div>
                      <div className="h-2 w-3/4 bg-muted/50 rounded animate-pulse"></div>
                    </div>
                    <div className="text-xs text-amber-600 font-medium bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded">Generating...</div>
                  </div>
                </div>

                {/* Visual Decoration */}
                <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero