"use client"
import React from "react";
import { motion } from "framer-motion";
import { Search, Database, BarChart3, ArrowRight, Check, Sparkles } from "lucide-react";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* LEFT SIDE: Visual Representation of the AI Agent */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative order-2 lg:order-1"
          >
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 rounded-full blur-3xl -z-10" />

            <div className="relative space-y-6">

              {/* Card 1: User Input Context */}
              <div className="bg-card border border-border rounded-xl p-5 shadow-lg max-w-md ml-auto relative z-10">
                <div className="flex items-center gap-3 mb-3 border-b border-border pb-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                    <Sparkles size={16} />
                  </div>
                  <span className="text-sm font-semibold text-foreground">Your Mission Context</span>
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-full bg-muted rounded-full" />
                  <div className="h-2 w-5/6 bg-muted rounded-full" />
                  <p className="text-xs text-muted-foreground mt-2 font-medium">
                    "We provide STEM education to underprivileged youth..."
                  </p>
                </div>
              </div>

              {/* Connecting Line */}
              <div className="h-12 w-0.5 bg-gradient-to-b from-border to-primary mx-auto relative">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary animate-ping" />
              </div>

              {/* Card 2: The Match Result */}
              <div className="bg-card border border-primary/20 rounded-xl p-0 shadow-2xl max-w-md mr-auto overflow-hidden">
                <div className="bg-primary/5 p-4 flex justify-between items-center border-b border-border">
                  <div className="flex items-center gap-2">
                    <Database size={14} className="text-primary" />
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">Grants.gov Match</span>
                  </div>
                  <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-2 py-1 rounded-full border border-green-200 dark:border-green-900">
                    98% Match Score
                  </span>
                </div>
                <div className="p-5">
                  <h4 className="font-bold text-lg mb-1">STEM Outreach Initiative 2025</h4>
                  <p className="text-xs text-muted-foreground mb-4">Department of Education • $50k - $200k</p>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-foreground/80">
                      <Check size={14} className="text-green-500" />
                      <span>Aligns with Youth Education focus</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-foreground/80">
                      <Check size={14} className="text-green-500" />
                      <span>Budget fits your $150k requirement</span>
                    </div>
                  </div>

                  <Link href="/search-grant" className="w-full mt-5 bg-primary text-primary-foreground h-9 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
                    Generate Proposal
                  </Link>
                </div>
              </div>

            </div>
          </motion.div>

          {/* RIGHT SIDE: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6 order-1 lg:order-2"
          >
            <div className="inline-flex items-center rounded-full border border-border px-3 py-1 text-sm font-medium text-muted-foreground w-fit bg-secondary/50">
              <Search className="w-3.5 h-3.5 mr-2" />
              Agent 01: Discovery
            </div>

            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
              Don't just search grants. <br />
              <span className="text-primary">Rank them.</span>
            </h2>

            <p className="text-lg text-muted-foreground">
              Stop wasting hours scrolling through Grants.gov. Our Discovery Agent connects directly to federal databases, analyzing thousands of opportunities in real-time.
            </p>

            <ul className="space-y-4 mt-2">
              {[
                {
                  icon: Database,
                  title: "Real-time Grants.gov Sync",
                  desc: "We fetch the latest NOFOs (Notice of Funding Opportunity) the moment they are released."
                },
                {
                  icon: BarChart3,
                  title: "Semantic Scoring Engine",
                  desc: "We don't just match keywords. We analyze your mission statement against the grant's eligibility criteria to give you a 0-100% compatibility score."
                },
              ].map((item, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <div className="mt-1 p-2 bg-secondary rounded-lg text-foreground">
                    <item.icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="pt-4">
              <button className="group text-primary font-medium inline-flex items-center hover:underline underline-offset-4">
                <Link href={'/search-grant'}>Try the Discovery Agent</Link>

                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;