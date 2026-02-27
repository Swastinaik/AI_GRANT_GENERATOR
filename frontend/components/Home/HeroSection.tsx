"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Clock,
  Search,
  TrendingUp,
  CheckCircle2,
  FileText
} from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-background pt-12 pb-24">

      {/* Background Color Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/3 w-[500px] h-[500px] bg-primary/20 blur-[140px] rounded-full" />
        <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-violet-100/10 blur-[140px] rounded-full" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* LEFT SIDE */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            <div className="inline-flex items-center rounded-full border border-border px-3 py-1 text-sm font-medium text-muted-foreground w-fit bg-secondary/50 backdrop-blur">
              <Sparkles className="w-3.5 h-3.5 mr-2 text-primary" />
              AI Grant Intelligence Platform
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
              <span className="text-foreground">Docs4All</span>
              <br />
              <span className="bg-gradient-to-r from-primary via-purple-500 to-violet-500 bg-clip-text text-transparent">
                Turn Context Into Winning Grants
              </span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-[520px]">
              Generate, discover, and review grant applications using
              AI agents that understand your organization’s mission and goals —
              cutting preparation time while increasing funding probability.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/generate-grant"
                className="h-12 px-8 rounded-lg bg-primary text-primary-foreground font-medium text-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary/30"
              >
                Start Writing Free
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/search-grant"
                className="h-12 px-8 rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground font-medium text-lg transition-colors flex items-center justify-center"
              >
                Explore Discovery
              </Link>
            </div>
          </motion.div>

          {/* RIGHT SIDE VISUAL */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >

            {/* Floating Glow Behind Cards */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-violet-500/10 blur-3xl rounded-full" />

            <div className="relative space-y-8">

              {/* 80% Card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity }}
                className="bg-card/90 backdrop-blur border border-primary/20 rounded-2xl p-6 shadow-2xl max-w-sm ml-auto"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                      80%
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Less Manual Writing
                    </p>
                  </div>
                </div>

                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "80%" }}
                    transition={{ duration: 1.8 }}
                    className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full"
                  />
                </div>
              </motion.div>

              {/* 2-3x Card */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 7, repeat: Infinity }}
                className="bg-card/90 backdrop-blur border border-blue-500/20 rounded-2xl p-6 shadow-xl max-w-sm mr-auto"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
                    <Search size={20} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-500">
                      2–3×
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Smarter Discovery
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 size={16} className="text-blue-500" />
                  Ranked by semantic match
                </div>
                <div className="flex items-center gap-2 text-sm mt-2">
                  <CheckCircle2 size={16} className="text-blue-500" />
                  Context-aware scoring
                </div>
              </motion.div>

              {/* Success Card */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 8, repeat: Infinity }}
                className="bg-card/90 backdrop-blur border border-emerald-500/20 rounded-2xl p-6 shadow-2xl max-w-sm ml-12"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-emerald-500">
                      Higher Approval
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Context Optimization
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <FileText size={16} className="text-emerald-500" />
                  AI weakness detection
                </div>
              </motion.div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;