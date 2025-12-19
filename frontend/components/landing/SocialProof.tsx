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

interface testimonialProps {
    name: String;
    role: String;
    content: String;
    rating: number
}
const SocialProof = ({testimonials}: {testimonials: testimonialProps[]}) => {
  return (
    <section id="reviews" className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-16">
           <div className="flex items-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
           </div>
           <h2 className="text-3xl font-bold tracking-tight">Trusted by 500+ Non-Profits</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               className="p-6 rounded-2xl bg-secondary/20 border border-border"
             >
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground font-medium mb-6">"{t.content}"</p>
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                      {t.name.charAt(0)}
                   </div>
                   <div>
                      <p className="text-sm font-bold">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                   </div>
                </div>
             </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof