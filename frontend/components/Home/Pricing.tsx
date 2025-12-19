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

const Pricing = () => {
  return (
    <section className="py-24 bg-secondary/30 border-t border-border">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Simple, Transparent Pricing</h2>
          <p className="text-muted-foreground">Start for free, upgrade when you need more power.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
           {/* Free Plan */}
           <div className="p-8 bg-card rounded-3xl border border-border flex flex-col">
              <h3 className="text-xl font-bold mb-2">Starter</h3>
              <p className="text-3xl font-bold mb-6">$0<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
              <ul className="space-y-3 mb-8 flex-1">
                 <li className="flex gap-2 text-sm"><Check size={16} className="text-primary"/> 1 Agent of choice</li>
                 <li className="flex gap-2 text-sm"><Check size={16} className="text-primary"/> 5 Generations/mo</li>
                 <li className="flex gap-2 text-sm"><Check size={16} className="text-primary"/> Basic Templates</li>
              </ul>
              <button className="w-full py-3 rounded-xl border border-input font-medium hover:bg-secondary transition-colors">Get Started</button>
           </div>

           {/* Pro Plan */}
           <div className="p-8 bg-primary text-primary-foreground rounded-3xl border border-primary relative shadow-2xl flex flex-col">
              <div className="absolute top-0 right-0 bg-background text-foreground text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl">POPULAR</div>
              <h3 className="text-xl font-bold mb-2">Pro Suite</h3>
              <p className="text-3xl font-bold mb-6">$29<span className="text-sm font-normal opacity-80">/mo</span></p>
              <ul className="space-y-3 mb-8 flex-1">
                 <li className="flex gap-2 text-sm"><Check size={16} /> Access to All 4 Agents</li>
                 <li className="flex gap-2 text-sm"><Check size={16} /> Unlimited Context Memory</li>
                 <li className="flex gap-2 text-sm"><Check size={16} /> Priority Processing</li>
                 <li className="flex gap-2 text-sm"><Check size={16} /> Advanced Analytics</li>
              </ul>
              <button className="w-full py-3 rounded-xl bg-background text-foreground font-bold hover:bg-secondary transition-colors">Try Free for 7 Days</button>
           </div>

           {/* Team Plan */}
           <div className="p-8 bg-card rounded-3xl border border-border flex flex-col">
              <h3 className="text-xl font-bold mb-2">Team</h3>
              <p className="text-3xl font-bold mb-6">$99<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
              <ul className="space-y-3 mb-8 flex-1">
                 <li className="flex gap-2 text-sm"><Check size={16} className="text-primary"/> 5 Seat License</li>
                 <li className="flex gap-2 text-sm"><Check size={16} className="text-primary"/> Shared Workspaces</li>
                 <li className="flex gap-2 text-sm"><Check size={16} className="text-primary"/> Admin Controls</li>
                 <li className="flex gap-2 text-sm"><Check size={16} className="text-primary"/> API Access</li>
              </ul>
              <button className="w-full py-3 rounded-xl border border-input font-medium hover:bg-secondary transition-colors">Contact Sales</button>
           </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing