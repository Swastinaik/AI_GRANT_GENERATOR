"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  FileText, 
  Mic, 
  Search, 
  ScanLine, 
  ArrowRight, 
  Sparkles,
  Filter,
  ArrowUpRight,
  Lock,
  Zap,
  Clock
} from "lucide-react";
import Link from "next/link";

// --- DATA ---

type AgentStatus = "live" | "beta" | "coming_soon";

interface Agent {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string; // Tailwind text color class
  bgColor: string; // Tailwind bg color class
  status: AgentStatus;
  capabilities: string[];
  href: string;
}

const allAgents: Agent[] = [
  {
    id: "grant-writer",
    title: "Grant Writer AI",
    description: "End-to-end grant proposal generation. Upload org data, get context-aware narratives, budgets, and cover letters.",
    icon: FileText,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    status: "live",
    capabilities: ["Context Awareness", "Parallel Generation", "Auto-Formatting"],
    href: "/landing-pages/grant-agent"
  },
  {
    id: "grant-discovery",
    title: "Grant Discovery",
    description: "Real-time semantic search engine that connects to Grants.gov to find and rank opportunities matching your mission.",
    icon: Search,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    status: "live",
    capabilities: ["Semantic Matching", "Eligibility Check", "Deadline Alerts"],
    href: "/landing-pages/search-grant-agent"
  },
  {
    id: "podcast-gen",
    title: "Podcast Generator",
    description: "Transform written content or prompts into vibrant, multi-speaker audio episodes with human-like intonation.",
    icon: Mic,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
    status: "beta",
    capabilities: ["Multi-Speaker", "Script Generation", "Audio Export"],
    href: "/landing-pages/podcast-agent"
  },
  {
    id: "resume-ats",
    title: "Resume Optimizer",
    description: "Tailor your resume for specific job descriptions to maximize ATS scores and interview chances.",
    icon: ScanLine,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    status: "live",
    capabilities: ["Keyword Injection", "Score Analysis", "PDF Parsing"],
    href: "/landing-pages/resume-agent"
  },
  {
    id: "legal-review",
    title: "Legal Doc Reviewer",
    description: "Analyze contracts and NDAs for risky clauses and generate plain-english summaries.",
    icon: Lock,
    color: "text-gray-500",
    bgColor: "bg-gray-500/10",
    status: "coming_soon",
    capabilities: ["Risk Detection", "Clause Comparison", "Simplification"],
    href: "#"
  },
  {
    id: "meeting-notes",
    title: "Meeting Summarizer",
    description: "Upload audio or transcripts to generate action items, summaries, and follow-up emails.",
    icon: Clock,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    status: "coming_soon",
    capabilities: ["Speaker ID", "Action Items", "Calendar Sync"],
    href: "#"
  }
];

// --- COMPONENTS ---

const StatusBadge = ({ status }: { status: AgentStatus }) => {
  switch (status) {
    case "live":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
          </span>
          Live
        </span>
      );
    case "beta":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
          Beta
        </span>
      );
    case "coming_soon":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-muted-foreground border border-border">
          Coming Soon
        </span>
      );
  }
};

export default function AgentsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter agents based on search
  const filteredAgents = allAgents.filter(agent => 
    agent.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    agent.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      
      {/* 1. Header Section */}
      <section className="pt-32 pb-12 border-b border-border/40 bg-secondary/20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center rounded-full border border-border px-3 py-1 text-sm font-medium text-muted-foreground bg-background mb-6"
            >
              <Zap className="w-3.5 h-3.5 mr-2 fill-yellow-500 text-yellow-500" />
              Docs4All Ecosystem
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
            >
              Intelligent Agents
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground"
            >
              Explore our suite of specialized AI tools. Each agent is designed to master a specific document workflow, powered by your unified context.
            </motion.p>
          </div>
        </div>
      </section>

      {/* 2. Controls & Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4 md:px-6">
          
          {/* Search Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search agents..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <div className="flex gap-2 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{filteredAgents.length}</span> Agents Available
            </div>
          </div>

          {/* Agents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAgents.map((agent, index) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`group flex flex-col h-full bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg hover:border-primary/50 transition-all duration-300 ${agent.status === 'coming_soon' ? 'opacity-70 grayscale-[0.5]' : ''}`}
              >
                {/* Card Header */}
                <div className="p-6 pb-4 flex justify-between items-start">
                  <div className={`w-14 h-14 rounded-2xl ${agent.bgColor} ${agent.color} flex items-center justify-center`}>
                    <agent.icon size={28} />
                  </div>
                  <StatusBadge status={agent.status} />
                </div>

                {/* Card Content */}
                <div className="px-6 flex-1">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {agent.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                    {agent.description}
                  </p>
                  
                  {/* Capabilities List */}
                  <div className="space-y-2 mb-6">
                    {agent.capabilities.map((cap, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs font-medium text-foreground/80">
                        <div className={`w-1.5 h-1.5 rounded-full ${agent.color.replace('text-', 'bg-')}`} />
                        {cap}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Footer / Action */}
                <div className="p-6 pt-0 mt-auto">
                   {agent.status !== 'coming_soon' ? (
                     <Link href={agent.href} className="flex items-center justify-center w-full py-3 rounded-xl bg-secondary text-secondary-foreground font-medium hover:bg-primary hover:text-primary-foreground transition-all group/btn">
                        Launch Agent 
                        <ArrowUpRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                     </Link>
                   ) : (
                     <button disabled className="flex items-center justify-center w-full py-3 rounded-xl border border-border bg-background text-muted-foreground cursor-not-allowed">
                        <Lock className="mr-2 w-4 h-4" />
                        Notify Me
                     </button>
                   )}
                </div>
              </motion.div>
            ))}
          </div>

          {filteredAgents.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No agents found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      </section>

      {/* 3. Bottom CTA */}
      <section className="py-24 border-t border-border mt-12">
        <div className="container mx-auto px-4 text-center">
           <h2 className="text-2xl font-bold mb-4">Don't see what you need?</h2>
           <p className="text-muted-foreground mb-8">
             We are constantly adding new agents to the Docs4All ecosystem. <br />
             Request a custom agent for your workflow.
           </p>
           <button className="h-10 px-6 rounded-full border border-input bg-background hover:bg-secondary transition-colors font-medium">
             Request Feature
           </button>
        </div>
      </section>

    </div>
  );
}