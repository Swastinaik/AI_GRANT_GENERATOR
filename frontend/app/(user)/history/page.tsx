"use client";

import React, { useEffect, useState } from 'react';
import { fetchWithAuth } from '@/app/lib/api';
import useAuthStore from '@/app/store/AuthStore';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Mic, ScanLine, Search, Zap, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

interface HistoryItem {
    id?: string; // Optional if your DB has IDs
    user_id: string;
    agent_name: string;
    description: string;
    time: string; // ISO String expected
}

export default function HistoryPage() {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const accessToken = useAuthStore((state) => state.accessToken);
    const setAccessToken = useAuthStore((state) => state.setAccessToken);

    // Helper for visuals (included here for copy-paste ease)
    const getAgentVisuals = (name: string) => {
        const lowerName = name?.toLowerCase() || "";
        if (lowerName.includes("grant")) return { icon: FileText, color: "text-emerald-500", bg: "bg-emerald-500/10" };
        if (lowerName.includes("resume")) return { icon: ScanLine, color: "text-orange-500", bg: "bg-orange-500/10" };
        if (lowerName.includes("podcast")) return { icon: Mic, color: "text-violet-500", bg: "bg-violet-500/10" };
        if (lowerName.includes("search")) return { icon: Search, color: "text-blue-500", bg: "bg-blue-500/10" };
        return { icon: Zap, color: "text-foreground", bg: "bg-secondary" };
    };

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);
                // Using the endpoint you provided
                const response = await fetchWithAuth(`http://localhost:8000/users/history`, { method: 'GET' }, accessToken, setAccessToken);

                if (!response.ok) throw new Error('Failed to fetch history');

                const data = await response.json();
                // Ensure data is an array
                setHistory(Array.isArray(data) ? data : []);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (accessToken) fetchHistory();
    }, [accessToken, setAccessToken]);

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/me" className="p-2 rounded-full hover:bg-secondary transition-colors">
                        <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Activity History</h1>
                        <p className="text-muted-foreground">Your recent generations and interactions.</p>
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => <div key={i} className="h-24 bg-card rounded-xl animate-pulse border border-border" />)}
                    </div>
                ) : error ? (
                    <div className="p-4 rounded-xl bg-destructive/10 text-destructive border border-destructive/20">
                        Error: {error}
                    </div>
                ) : history.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground bg-card rounded-xl border border-border">
                        <Clock className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>No history found. Start using an agent!</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {history.map((item, index) => {
                            const visual = getAgentVisuals(item.agent_name);
                            const Icon = visual.icon;

                            // Date formatting logic
                            let dateStr = item.time;
                            try {
                                // If using date-fns: format(new Date(item.time), 'PPP p')
                                // Native fallback:
                                dateStr = new Date(item.time).toLocaleString('en-US', {
                                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                });
                            } catch (e) { dateStr = item.time }

                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 bg-card border border-border rounded-xl hover:shadow-md transition-all hover:border-primary/30"
                                >
                                    {/* Icon Box */}
                                    <div className={`w-12 h-12 rounded-lg ${visual.bg} ${visual.color} flex items-center justify-center shrink-0`}>
                                        <Icon size={20} />
                                    </div>

                                    {/* Text Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                                            <h3 className="font-bold text-foreground truncate">{item.agent_name}</h3>
                                            <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded-full w-fit">
                                                {dateStr}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {item.description}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}