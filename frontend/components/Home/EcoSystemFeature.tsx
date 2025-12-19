"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  FileText, 
  Mic, 
  Search, 
  ScanLine, 
  ArrowRight, 
  Check, 
  Database,
  Share2,
  Lock
} from "lucide-react";

 const EcosystemFeature = () => {
  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Text */}
          <div>
            <div className="inline-flex items-center rounded-full border border-border px-3 py-1 text-sm font-medium text-muted-foreground w-fit bg-secondary mb-6">
               <Database className="w-3.5 h-3.5 mr-2" />
               Unified Context Engine
            </div>
            <h2 className="text-4xl font-bold tracking-tight mb-6">
              Upload Once. <br />
              <span className="text-primary">Use Everywhere.</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Docs4All isn't just a collection of tools. It's an ecosystem. Upload your company profile, resume, or past projects once to your <strong>Central Vault</strong>. Every agent instantly gets smarter about who you are.
            </p>
            
            <ul className="space-y-4">
              {[
                "Context-aware generation across all agents",
                "Bank-grade encryption for your documents",
                "Share workspaces with your team"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
                    <Check size={14} />
                  </div>
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Graphic: Connecting Hub */}
          <div className="relative">
             <div className="relative z-10 bg-card border border-border rounded-2xl p-8 shadow-2xl">
                {/* Central File */}
                <div className="flex items-center gap-4 mb-8 p-4 bg-secondary/50 rounded-xl border border-border">
                   <div className="w-12 h-12 bg-primary/20 text-primary flex items-center justify-center rounded-lg">
                      <Database size={24} />
                   </div>
                   <div>
                      <p className="font-bold">Company_Profile_2025.pdf</p>
                      <p className="text-xs text-muted-foreground">Uploaded to Central Vault</p>
                   </div>
                </div>

                {/* Arrows */}
                <div className="grid grid-cols-3 gap-4 text-center">
                   {/* Arrow 1 */}
                   <div className="flex flex-col items-center gap-2">
                      <div className="h-8 w-0.5 bg-gradient-to-b from-border to-emerald-500" />
                      <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border border-emerald-100 dark:border-emerald-900/50">
                        <FileText size={20} />
                      </div>
                      <span className="text-xs font-medium">Grant</span>
                   </div>
                   {/* Arrow 2 */}
                   <div className="flex flex-col items-center gap-2">
                      <div className="h-8 w-0.5 bg-gradient-to-b from-border to-violet-500" />
                      <div className="p-3 rounded-lg bg-violet-50 dark:bg-violet-900/20 text-violet-600 border border-violet-100 dark:border-violet-900/50">
                        <Mic size={20} />
                      </div>
                      <span className="text-xs font-medium">Podcast</span>
                   </div>
                   {/* Arrow 3 */}
                   <div className="flex flex-col items-center gap-2">
                      <div className="h-8 w-0.5 bg-gradient-to-b from-border to-orange-500" />
                      <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-600 border border-orange-100 dark:border-orange-900/50">
                        <ScanLine size={20} />
                      </div>
                      <span className="text-xs font-medium">Resume</span>
                   </div>
                </div>
             </div>
             
             {/* Background Glow */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-primary/5 rounded-full blur-3xl -z-10" />
          </div>

        </div>
      </div>
    </section>
  );
};

export default EcosystemFeature