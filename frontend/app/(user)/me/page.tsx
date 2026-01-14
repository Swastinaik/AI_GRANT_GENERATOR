"use client";

import React, { useEffect, useState } from 'react';
import { fetchWithAuth } from '@/app/lib/api';
import useAuthStore from '@/app/store/AuthStore';
import { Progress } from "@/components/ui/progress"; // Assuming shadcn component
import { mapUsageToProgress, formatDate } from '@/app/lib/utils/helpers';
import { services } from '@/app/constants/constants'; // Your existing services
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    History,
    CreditCard,
    CalendarDays,
    ArrowRight,
    LayoutDashboard,
    FileText, Mic, ScanLine, Search, Zap
} from 'lucide-react';

// --- Visual Helpers ---
const getServiceIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('grant')) return FileText;
    if (lower.includes('resume')) return ScanLine;
    if (lower.includes('podcast')) return Mic;
    if (lower.includes('search')) return Search;
    return Zap;
};

// --- Component ---

const Me = () => {
    const [user, setUser] = useState<string | null>(null);
    const [usage, setUsage] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [progress, setProgress] = useState(0);

    const accessToken = useAuthStore((state) => state.accessToken);
    const setAccessToken = useAuthStore((state) => state.setAccessToken);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if(!accessToken){
                    return
                }
                setLoading(true);
                const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, { method: 'POST' }, accessToken, setAccessToken);
                if (!response.ok) throw new Error('Failed to fetch user data');

                const data = await response.json();
                const { user, usage } = data;

                // Assuming 5 is max limit (hardcoded based on your snippet)
                const maxLimit = 5;
                const calcProgress = (usage?.count / maxLimit) * 100;

                setProgress(calcProgress);
                setUser(user.username);
                setUsage(usage);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
        if (accessToken) fetchUserData();
    }, [accessToken]);

    // Loading Skeleton
    if (loading) {
        return <div className="min-h-screen bg-background p-8 flex items-center justify-center text-muted-foreground">Loading dashboard...</div>
    }

    return (
        <div className="min-h-screen bg-background text-foreground p-4 md:p-8 font-sans">
            <div className="max-w-6xl mx-auto space-y-12">

                {/* 1. Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-border"
                >
                    <div>
                        <div className="inline-flex items-center rounded-full border border-border px-3 py-1 text-sm font-medium text-muted-foreground bg-secondary/30 mb-2">
                            <LayoutDashboard className="w-3.5 h-3.5 mr-2" />
                            Overview
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight">
                            Welcome back, <span className="text-primary">{user}</span>
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Manage your agents and view your generation limits.
                        </p>
                    </div>

                    {/* Date Badge */}
                    <div className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg shadow-sm">
                        <CalendarDays className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">{usage?.date ? formatDate(usage.date) : "Today"}</span>
                    </div>
                </motion.div>


                {/* 2. Stats & Quick Actions Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Usage Card (Plan Status) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-2 bg-gradient-to-br from-card to-secondary/10 border border-border rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-lg"
                    >
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-lg font-bold flex items-center gap-2">
                                        <CreditCard className="w-5 h-5 text-primary" />
                                        Credits Usage
                                    </h2>
                                    <p className="text-muted-foreground text-sm">Daily generation limit</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-3xl font-bold">{usage?.count || 0}</span>
                                    <span className="text-muted-foreground text-lg">/5</span>
                                </div>
                            </div>

                            <Progress value={progress} className="h-3 bg-secondary" />

                            <div className="flex justify-between mt-4 text-xs font-medium text-muted-foreground">
                                <span>0 Generations</span>
                                <span>{100 - progress}% Remaining</span>
                            </div>
                        </div>
                        {/* Decorative BG Blob */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-0 translate-x-1/3 -translate-y-1/3" />
                    </motion.div>

                    {/* History CTA Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-card border border-border rounded-2xl p-6 md:p-8 flex flex-col justify-between hover:border-primary/50 transition-colors group cursor-pointer"
                    >
                        <div>
                            <div className="w-10 h-10 bg-violet-500/10 text-violet-500 rounded-lg flex items-center justify-center mb-4">
                                <History size={20} />
                            </div>
                            <h2 className="text-lg font-bold">View History</h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                View past grants, podcasts, and resumes.
                            </p>
                        </div>
                        <Link href="/history" className="flex items-center text-sm font-bold text-primary mt-6 group-hover:underline underline-offset-4">
                            View All History <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </motion.div>
                </div>


                {/* 3. Services Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h2 className="text-2xl font-bold tracking-tight mb-6 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-500" />
                        Available Agents
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((service, index) => {
                            const Icon = getServiceIcon(service.name);
                            return (
                                <Link key={index} href={service.link}>
                                    <div className="group h-full bg-card border border-border rounded-2xl p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 relative overflow-hidden">

                                        <div className="flex items-start justify-between mb-4">
                                            <div className="p-3 bg-secondary rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                                <Icon size={24} />
                                            </div>
                                            <ArrowRight className="w-5 h-5 text-muted-foreground -rotate-45 group-hover:rotate-0 group-hover:text-primary transition-all duration-300" />
                                        </div>

                                        <h3 className="text-xl font-bold mb-2">{service.name}</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {service.description}
                                        </p>

                                        {/* Hover Gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

export default Me;