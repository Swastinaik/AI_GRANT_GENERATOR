"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText,
  Mic,
  Search,
  ScanLine,
  Layers,
  ArrowRight,
  Sparkles,
  Cpu
} from "lucide-react";

// Micro-component for the Floating Agent Cards
const AgentCard = ({
  icon: Icon,
  title,
  color,
  delay,
  position
}: {
  icon: any,
  title: string,
  color: string,
  delay: number,
  position: string
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{
      opacity: 1,
      scale: 1,
      y: [0, -10, 0]
    }}
    transition={{
      opacity: { duration: 0.5, delay: delay },
      scale: { duration: 0.5, delay: delay },
      y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: delay } // Floating effect
    }}
    className={`absolute ${position} z-20`}
  >
    <div className="flex items-center gap-3 bg-card/80 backdrop-blur-md border border-border px-4 py-3 rounded-2xl shadow-xl hover:scale-105 transition-transform cursor-default">
      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center text-white shadow-md`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Agent</p>
        <p className="text-sm font-bold text-foreground">{title}</p>
      </div>
    </div>
  </motion.div>
);

const DocsAllHero = () => {
  return (
    <section className="relative pt-10 pb-32 md:pt-10 md:pb-48 overflow-hidden bg-background">

      {/* Background Mesh Gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl opacity-30 pointer-events-none">
        <div className="absolute top-[20%] left-[20%] w-72 h-72 bg-primary/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[20%] right-[20%] w-72 h-72 bg-blue-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center text-center mb-16 lg:mb-24">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center rounded-full border border-border px-4 py-1.5 text-sm font-medium text-muted-foreground bg-secondary/30 mb-8 backdrop-blur-sm"
          >
            <Sparkles className="w-3.5 h-3.5 mr-2 text-primary" />
            Introducing the Unified AI Suite
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.1] max-w-4xl"
          >
            One Platform. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
              Infinite Possibilities.
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Docs4All is your central command center. Access specialized AI agents to write grants, optimize resumes, and generate podcasts—all in one place.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 mt-10"
          >
            <Link href="/agents" className="h-12 px-8 rounded-full bg-primary text-primary-foreground font-medium text-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:shadow-xl">

              Explore All Agents <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/docs/grant-writer" className="h-12 px-8 rounded-full border border-input flex items-center justify-center gap-2 bg-background hover:bg-secondary transition-colors font-medium text-lg">
              View Documentation
            </Link>
          </motion.div>
        </div>

        {/* ECOSYSTEM VISUALIZATION */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative w-full max-w-4xl mx-auto h-[400px] md:h-[500px]"
        >
          {/* Central Hub Node */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-background border border-border shadow-2xl flex items-center justify-center relative">
              {/* Pulsing rings */}
              <div className="absolute inset-0 rounded-3xl bg-primary/20 animate-ping opacity-20" />
              <div className="absolute -inset-4 rounded-[40px] border border-primary/20 opacity-50" />

              <Layers className="w-10 h-10 md:w-12 md:h-12 text-primary" />
            </div>
            <div className="mt-4 px-3 py-1 rounded-full bg-background border border-border text-xs font-bold shadow-sm">
              Docs4All Core
            </div>
          </div>

          {/* Connection Lines (SVG) */}
          <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none stroke-border/60" style={{ strokeWidth: 2 }}>
            {/* Lines radiating from center to approximate card positions */}
            <motion.path
              d="M50% 50% L20% 20%"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.5 }}
            />
            <motion.path
              d="M50% 50% L80% 25%"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.7 }}
            />
            <motion.path
              d="M50% 50% L20% 75%"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.9 }}
            />
            <motion.path
              d="M50% 50% L80% 70%"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 1.1 }}
            />
          </svg>

          {/* Floating Agent Cards */}

          {/* 1. Grant Agent (Top Left) */}
          <AgentCard
            title="Grant Writer"
            icon={FileText}
            color="bg-emerald-500"
            position="top-[10%] left-[5%] md:left-[10%]"
            delay={0.6}
          />

          {/* 2. Podcast Agent (Top Right) */}
          <AgentCard
            title="Podcast AI"
            icon={Mic}
            color="bg-violet-500"
            position="top-[15%] right-[5%] md:right-[10%]"
            delay={0.8}
          />

          {/* 3. Resume Agent (Bottom Left) */}
          <AgentCard
            title="Resume ATS"
            icon={ScanLine}
            color="bg-orange-500"
            position="bottom-[15%] left-[5%] md:left-[10%]"
            delay={1.0}
          />

          {/* 4. Search Agent (Bottom Right) */}
          <AgentCard
            title="Grant Discovery"
            icon={Search}
            color="bg-blue-500"
            position="bottom-[20%] right-[5%] md:right-[15%]"
            delay={1.2}
          />

        </motion.div>
      </div>
    </section>
  );
};

export default DocsAllHero;