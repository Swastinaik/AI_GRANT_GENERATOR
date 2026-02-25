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

const agents = [
  {
    id: "grant-writer",
    title: "Grant Writer AI",
    desc: "Generate full grant proposals, cover letters, and budgets from organization data.",
    icon: FileText,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    link: "/agents/grant",
    cols: "md:col-span-2"
  },
  {
    id: "grant-reviewer",
    title: "Grant Reviewer",
    desc: "Review grant proposals and provide feedback.",
    icon: ScanLine,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    link: "/agents/resume",
    cols: "md:col-span-1"
  },
  {
    id: "podcast-gen",
    title: "Podcast Generator",
    desc: "Turn documents or prompts into vibrant, multi-speaker audio conversations.",
    icon: Mic,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
    link: "/agents/podcast",
    cols: "md:col-span-1"
  },
  {
    id: "grant-search",
    title: "Discovery Agent",
    desc: "Real-time semantic search and matching for federal and private grants.",
    icon: Search,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    link: "/agents/search",
    cols: "md:col-span-2"
  }
];

const AgentSuite = () => {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Your Intelligent Workforce</h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Select an agent to start a task. All agents share your central document library context.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {agents.map((agent, i) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`group relative overflow-hidden rounded-3xl bg-card border border-border p-8 hover:shadow-xl transition-all duration-300 ${agent.cols}`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`w-14 h-14 rounded-2xl ${agent.bg} ${agent.color} flex items-center justify-center`}>
                  <agent.icon size={28} />
                </div>
                <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-background">
                  <ArrowRight size={16} className="-rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                </div>
              </div>

              <h3 className="text-2xl font-bold mb-2">{agent.title}</h3>
              <p className="text-muted-foreground mb-4">{agent.desc}</p>

              {/* Decorative gradient overlay */}
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AgentSuite