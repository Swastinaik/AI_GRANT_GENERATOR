"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Upload,
  CheckCircle2,
  ArrowRight,
  Target,
  ScanLine,
  Briefcase
} from "lucide-react";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative pt-10 pb-32  md:pb-48 overflow-hidden bg-background">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-secondary/40 to-transparent -z-10" />

      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-6"
          >
            {/* Badge */}
            <div className="inline-flex items-center rounded-full border border-border px-3 py-1 text-sm font-medium text-muted-foreground w-fit bg-background shadow-sm">
              <ScanLine className="w-3.5 h-3.5 mr-2 text-primary" />
              ATS Optimization Engine
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
              Beat the Bots. <br />
              <span className="text-primary">Land the Interview.</span>
            </h1>

            {/* Subhead */}
            <p className="text-lg text-muted-foreground max-w-[500px]">
              Don't let an algorithm reject your dream job. Upload your profile and the job description. Our AI tailor-makes your resume to hit a 95%+ ATS match score instantly.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Link href={'/resume-generate'} className="h-12 px-8 rounded-lg bg-primary text-primary-foreground font-medium text-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                <Upload className="w-4 h-4" />
                Upload Resume
              </Link>
              <Link href={'/resume-generate'} className="h-12 px-8 rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground font-medium text-lg transition-colors">
                View Sample
              </Link>
            </div>

            {/* Trust Metric */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-secondary flex items-center justify-center text-xs font-bold">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <p>Used by candidates at Google, Meta, and Netflix</p>
            </div>
          </motion.div>

          {/* RIGHT VISUAL: The Match Simulation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl border border-border bg-card/50 backdrop-blur-sm shadow-2xl p-6 lg:p-8 aspect-[4/3] lg:aspect-square flex flex-col justify-center">

              {/* 1. The Job Target (Top Right) */}
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute top-8 right-8 w-48 bg-background border border-border rounded-lg p-4 shadow-sm z-10"
              >
                <div className="flex items-center gap-2 mb-2 border-b border-border pb-2">
                  <Briefcase className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-bold">Target Job</span>
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-full bg-muted rounded animate-pulse" />
                  <div className="h-2 w-2/3 bg-muted rounded animate-pulse" />
                  <div className="flex gap-1 flex-wrap mt-2">
                    <span className="text-[10px] bg-secondary px-1 rounded text-primary">React</span>
                    <span className="text-[10px] bg-secondary px-1 rounded text-primary">Next.js</span>
                  </div>
                </div>
              </motion.div>

              {/* 2. The User Resume (Center) */}
              <div className="bg-background border border-border rounded-xl shadow-lg p-6 max-w-sm mx-auto w-full relative z-20">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <FileText size={20} />
                    </div>
                    <div>
                      <div className="h-3 w-24 bg-foreground/80 rounded mb-1" />
                      <div className="h-2 w-16 bg-muted-foreground/50 rounded" />
                    </div>
                  </div>
                  {/* Live Score Badge */}
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">ATS Score</span>
                    <div className="text-2xl font-bold text-green-600 flex items-center gap-1">
                      94
                      <span className="text-sm text-muted-foreground">%</span>
                    </div>
                  </div>
                </div>

                {/* Resume Content Mockup */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="h-2 w-full bg-secondary rounded" />
                    <div className="h-2 w-full bg-secondary rounded" />
                    <div className="h-2 w-3/4 bg-secondary rounded" />
                  </div>

                  {/* Comparison Logic Visualization */}
                  <div className="p-3 bg-secondary/30 rounded-lg border border-border/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-muted-foreground">Keywords Matched</span>
                      <span className="text-xs font-bold text-primary">12/15</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: "20%" }}
                        whileInView={{ width: "85%" }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        className="h-full bg-primary rounded-full"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <div className="flex-1 h-8 rounded bg-primary text-primary-foreground text-xs font-medium flex items-center justify-center">
                      Download PDF
                    </div>
                    <div className="w-8 h-8 rounded border border-input flex items-center justify-center hover:bg-accent">
                      <Target size={14} />
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Decorative Elements */}
              <div className="absolute bottom-12 left-12 p-3 bg-background border border-border rounded-lg shadow-sm z-10 flex items-center gap-3 animate-bounce duration-[3000ms]">
                <div className="bg-green-100 dark:bg-green-900/30 text-green-600 p-1.5 rounded-full">
                  <CheckCircle2 size={16} />
                </div>
                <div className="text-xs">
                  <span className="block font-bold">Format Verified</span>
                  <span className="text-muted-foreground">Standard Layout</span>
                </div>
              </div>

              {/* Glow Effect */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-primary/10 rounded-full blur-3xl -z-10" />

            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;