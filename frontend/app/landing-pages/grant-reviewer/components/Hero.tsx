"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    FileCheck,
    BarChart3,
    ShieldCheck,
    ArrowRight,
    Search,
    AlertCircle,
    PieChart
} from "lucide-react";
import Link from "next/link";

// Helper for the Score Gauge Animation
const ScoreGauge = ({ score }: { score: number }) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* Background Circle */}
                <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-muted/20"
                />
                {/* Progress Circle */}
                <motion.circle
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeLinecap="round"
                    className="text-primary drop-shadow-[0_0_4px_rgba(var(--primary),0.5)]"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-foreground">
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-3xl font-bold"
                >
                    {score}
                </motion.span>
                <span className="text-[10px] uppercase font-bold text-muted-foreground">/100</span>
            </div>
        </div>
    );
};

const Hero = () => {
    return (
        <section className="relative pt-10 pb-32 md:pb-48 overflow-hidden bg-background">

            {/* Background Decor - Hybrid of the other two styles */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[100px] -z-10" />

            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* LEFT SIDE: Copy & Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col gap-6"
                    >
                        {/* Pill Badge */}
                        <div className="inline-flex items-center rounded-full border border-border px-3 py-1 text-sm font-medium text-muted-foreground w-fit bg-card shadow-sm backdrop-blur-sm">
                            <ShieldCheck className="w-3.5 h-3.5 mr-2 text-primary" />
                            AI Funding Probability Engine
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
                            Validate Your Vision. <br />
                            <span className="text-primary">Secure the Funding.</span>
                        </h1>

                        <p className="text-lg text-muted-foreground max-w-[520px] leading-relaxed">
                            Don't leave your grant application to chance. Upload your proposal and let our AI act as your personal review committee—scoring your odds and fixing weaknesses instantly.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mt-4">
                            <Link href={'/grant-reviewer'} className="h-12 px-8 rounded-xl bg-primary text-primary-foreground font-medium text-md hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:scale-105 duration-200">
                                <FileCheck className="w-4 h-4" />
                                Review Application
                            </Link>
                            <Link href={'/grant-reviewer'} className="h-12 px-8 rounded-xl border border-input bg-background hover:bg-secondary/80 font-medium text-md transition-colors flex items-center justify-center gap-2">
                                <BarChart3 className="w-4 h-4 text-muted-foreground" />
                                See Sample Report
                            </Link>
                        </div>

                        {/* Micro Interaction / Stats */}
                        <div className="flex items-center gap-6 pt-6 border-t border-border/50 mt-2">
                            <div>
                                <p className="text-2xl font-bold text-foreground">$50M+</p>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider">Funds Secured</p>
                            </div>
                            <div className="w-px h-8 bg-border" />
                            <div>
                                <p className="text-2xl font-bold text-green-600">+25%</p>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider">Approval Rate</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* RIGHT SIDE: The Scoring Dashboard Visualization */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative"
                    >
                        {/* Background Layer: The "Document" being analyzed */}
                        <motion.div
                            animate={{ y: [0, -8, 0], rotate: [1, 3, 1] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-[-20px] right-[-10px] w-full max-w-sm aspect-[4/5] bg-background border border-border rounded-xl shadow-lg z-0 opacity-40 scale-90 origin-bottom-right p-6"
                        >
                            <div className="h-4 w-1/2 bg-muted rounded mb-4" />
                            <div className="space-y-3">
                                <div className="h-2 w-full bg-muted/40 rounded" />
                                <div className="h-2 w-full bg-muted/40 rounded" />
                                <div className="h-2 w-full bg-muted/40 rounded" />
                                <div className="h-2 w-3/4 bg-muted/40 rounded" />
                            </div>
                        </motion.div>

                        {/* Main Layer: The Analysis Card */}
                        <div className="relative z-10 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm max-w-md mx-auto">

                            {/* Card Header */}
                            <div className="p-6 border-b border-border/50 flex justify-between items-center bg-secondary/20">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                        <PieChart size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm">Analysis Report</h3>
                                        <p className="text-xs text-muted-foreground">Project: Clean Energy Initiative</p>
                                    </div>
                                </div>
                                <div className="px-2 py-1 bg-green-500/10 text-green-600 border border-green-500/20 rounded text-[10px] font-bold uppercase tracking-wider">
                                    Ready
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-6 flex flex-col items-center">

                                {/* The Gauge */}
                                <div className="mb-6">
                                    <ScoreGauge score={88} />
                                </div>

                                {/* Analysis List */}
                                <div className="w-full space-y-3">
                                    {/* Item 1 */}
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-green-500" />
                                            <span className="text-sm font-medium">Budget Clarity</span>
                                        </div>
                                        <span className="text-xs font-bold text-foreground">Excellent</span>
                                    </div>

                                    {/* Item 2 */}
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-yellow-500" />
                                            <span className="text-sm font-medium">Impact Metrics</span>
                                        </div>
                                        <span className="text-xs font-bold text-foreground">Needs Detail</span>
                                    </div>

                                    {/* Item 3 */}
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-green-500" />
                                            <span className="text-sm font-medium">Compliance</span>
                                        </div>
                                        <span className="text-xs font-bold text-foreground">Passed</span>
                                    </div>
                                </div>

                            </div>

                            {/* Footer / CTA */}
                            <div className="p-4 bg-secondary/50 border-t border-border/50 flex gap-3">
                                <button className="flex-1 py-2 rounded-lg bg-foreground text-background text-xs font-bold hover:opacity-90 transition-opacity">
                                    Download Full Report
                                </button>
                            </div>
                        </div>

                        {/* Floating Elements (Decorative) */}
                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                            className="absolute -bottom-8 -right-4 p-3 bg-background border border-border rounded-xl shadow-lg flex items-center gap-3 z-20"
                        >
                            <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-full text-orange-600">
                                <AlertCircle size={16} />
                            </div>
                            <div className="text-xs">
                                <span className="block font-bold">2 Critical Fixes</span>
                                <span className="text-muted-foreground">Suggested by AI</span>
                            </div>
                        </motion.div>

                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;