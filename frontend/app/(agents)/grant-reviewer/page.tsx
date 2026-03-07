"use client"

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import useAuthStore from "@/app/store/AuthStore";
import { fetchWithAuth } from "@/app/lib/api";
import {
    UploadCloud,
    FileText,
    ArrowLeft,
    Sparkles,
    RefreshCcw,
    CheckCircle2,
    Lightbulb
} from "lucide-react";
import ErrorFallBack from "@/app/components/ErrorBoundary";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function GrantReviewer() {
    const [grantDescription, setGrantDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [score, setScore] = useState(80);
    const [recommendation, setRecommendation] = useState<string[]>([
        "This is the first incredibly long line of text that goes on and on for quite a while to satisfy the requirement of being a lengthy string within this JavaScript array.",
        "Here we have the second lengthy string, which is packed with enough words and characters to ensure it stretches across the screen and clearly fulfills the prompt's criteria.",
        "Moving on to the third element, we find yet another prolonged sequence of characters forming a sentence that is deliberately designed to be quite wordy, descriptive, and extensive.",
        "Finally, the fourth and last string in this collection rounds out the array with a similarly extended length, providing a complete set of four verbose string elements for your use."
    ]);
    const [error, setError] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const accessToken = useAuthStore((state) => state.accessToken);
    const setAccessToken = useAuthStore((state) => state.setAccessToken);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFile(file);
        }
    };

    const handleReset = () => {
        setGrantDescription('');
        setFile(null);
        setRecommendation([]);
        setScore(0);
        setError('');
    };

    const handleSubmit = async () => {
        if (!accessToken) {
            return;
        }
        if (!grantDescription.trim() || !file) {
            setError("Please enter a description and upload a file.");
            return;
        }

        setError('');
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('grant_description', grantDescription);
            formData.append('grant_file', file);

            const response = await fetchWithAuth(`${API_BASE_URL}/grant-reviewer`, {
                method: 'POST',
                body: formData
            }, accessToken, setAccessToken);

            if (!response.ok) {
                throw new Error('Failed to review grant');
            }

            const data = await response.json();
            setScore(data.score);
            setRecommendation(data.recommendation);
        } catch (error) {
            setError("Failed to review grant");
        } finally {
            setLoading(false);
        }
    };

    // Helper for visual score color
    const getScoreColor = (currentScore: number) => {
        if (currentScore >= 80) return "text-emerald-500";
        if (currentScore >= 50) return "text-amber-500";
        return "text-destructive";
    };

    if (error) {
        return <ErrorFallBack error={error} />;
    }

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">

            {/* Unified Top Navigation */}
            <nav className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link
                        href="/"
                        className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </Link>
                    {recommendation.length > 0 && (
                        <Button variant="ghost" size="sm" onClick={handleReset} className="text-muted-foreground">
                            <RefreshCcw className="w-4 h-4 mr-2" />
                            Review Another
                        </Button>
                    )}
                </div>
            </nav>

            {/* Main Container - Matched to MultiStepTemplateForm */}
            <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
                {recommendation.length > 0 ? (

                    /* --- RESULTS VIEW (Kept in cards for data visualization readability) --- */
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
                        <div className="text-center mb-10">
                            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">Review Results</h1>
                            <p className="text-muted-foreground text-lg">Here is the analysis and score for your grant proposal.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Score Card */}
                            <Card className="md:col-span-1 border-border shadow-sm bg-card flex flex-col items-center justify-center py-8 px-4 text-center">
                                <p className="text-lg font-semibold text-muted-foreground uppercase tracking-widest mb-6">Overall Score</p>
                                <div className="relative flex items-center justify-center">
                                    <svg viewBox="0 0 128 128" className="w-32 h-32 -rotate-90">
                                        <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-muted/30" />
                                        <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent"
                                            strokeDasharray={377}
                                            strokeDashoffset={377 - (377 * score) / 100}
                                            className={`${getScoreColor(score)} transition-all duration-1000 ease-out`}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center text-4xl font-black">
                                        <span className={getScoreColor(score)}>{score}</span>
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground mt-6">Out of 100 points</p>
                            </Card>

                            {/* Recommendations Card */}
                            <Card className="md:col-span-2 border-border shadow-sm bg-card">
                                <CardHeader className="border-b border-border bg-muted/20 pb-4">
                                    <CardTitle className="flex items-center text-xl font-bold">
                                        <Lightbulb className="w-5 h-5 mr-2 text-primary" />
                                        Actionable Recommendations
                                    </CardTitle>
                                    <CardDescription>Areas of improvement identified by the reviewer AI.</CardDescription>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <ScrollArea className="h-[400px] w-full p-6">
                                        <div className="space-y-6">
                                            {recommendation.map((rec, index) => (
                                                <div key={index} className="flex gap-4 p-4 rounded-xl bg-muted/30 border border-muted-foreground/10 hover:border-primary/20 transition-colors">
                                                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                                                    <p className="text-sm leading-relaxed text-foreground">{rec}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                ) : (

                    /* --- INPUT FORM VIEW (Card removed, full-page flow applied) --- */
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="mb-10">
                            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
                                Grant Reviewer
                            </h1>
                            <p className="text-muted-foreground text-lg">
                                Upload your grant proposal and provide a brief context to receive actionable feedback and a quality score.
                            </p>
                        </div>

                        <form className="space-y-10">

                            {/* File Upload Area */}
                            <div className="space-y-4">
                                <Label className="text-base font-semibold">Upload Grant File <span className="text-destructive">*</span></Label>
                                <label className={`relative flex flex-col items-center justify-center w-full p-10 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 
                                    ${file ? 'border-primary bg-primary/5' : 'border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/30'}`}>
                                    <div className="flex flex-col items-center justify-center space-y-3 text-center">
                                        {file ? (
                                            <FileText className="w-10 h-10 text-primary" />
                                        ) : (
                                            <UploadCloud className="w-10 h-10 text-muted-foreground" />
                                        )}
                                        <div>
                                            <p className="text-sm font-medium text-foreground">
                                                {file ? file.name : "Click to upload or drag and drop"}
                                            </p>
                                            {!file && <p className="text-xs text-muted-foreground mt-1">PDF, DOCX, or TXT format (Max 10MB)</p>}
                                        </div>
                                    </div>
                                    <Input
                                        type="file"
                                        className="hidden"
                                        onChange={handleFileChange}
                                        accept=".pdf,.doc,.docx,.txt"
                                    />
                                </label>
                            </div>

                            {/* Description Area */}
                            <div className="space-y-4">
                                <Label className="text-base font-semibold">Grant Context & Description <span className="text-destructive">*</span></Label>
                                <Textarea
                                    value={grantDescription}
                                    onChange={(e) => setGrantDescription(e.target.value)}
                                    required
                                    placeholder="Provide a detailed description of the grant, the funding organization, or specific areas you want the reviewer to focus on..."
                                    rows={6}
                                    className="resize-none rounded-xl text-base p-4 bg-background border-muted-foreground/30 focus:border-primary focus:ring-primary/20"
                                />
                            </div>

                            {/* Submit Button - Matched footer style */}
                            <div className="pt-8 mt-8 border-t border-border flex flex-col-reverse sm:flex-row items-center sm:justify-end gap-4">
                                <Button
                                    type="button"
                                    size="lg"
                                    onClick={handleSubmit}
                                    disabled={!grantDescription.trim() || !file || loading}
                                    className="w-full sm:w-auto h-12 px-8 text-base rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 transition-all"
                                >
                                    {loading ? (
                                        "Analyzing Proposal..."
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5 mr-2" />
                                            Review Grant
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
}