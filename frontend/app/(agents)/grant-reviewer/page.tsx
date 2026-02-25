"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
    Loader2,
    ArrowLeft,
    UploadCloud,
    Upload,
    FileText,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import HomeButton from "@/app/components/HomeButton";
import useAuthStore from "@/app/store/AuthStore";
import { fetchWithAuth } from "@/app/lib/api";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function GrantReviewer() {
    const [grantDescription, setGrantDescription] = useState('')
    const [loading, setLoading] = useState(false)
    const [score, setScore] = useState(80)
    const [recommendation, setRecommendation] = useState<string[]>([

    ])
    const [error, setError] = useState('')
    const [file, setFile] = useState<File | null>(null)
    const accessToken = useAuthStore((state) => state.accessToken)
    const setAccessToken = useAuthStore((state) => state.setAccessToken)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setFile(file)
        }
    }

    const handleSubmit = async () => {
        if (!accessToken) {
            return
        }
        if (!grantDescription.trim() || !file) {
            setError("Please enter a topic or upload a file.");
            return;
        }

        setError('')
        setLoading(true)
        try {
            const formData = new FormData()
            formData.append('grant_description', grantDescription)
            formData.append('grant_file', file)
            const response = await fetchWithAuth(`${API_BASE_URL}/grant-reviewer`, {
                method: 'POST',
                body: formData
            },
                accessToken,
                setAccessToken)
            if (!response.ok) {
                throw new Error('Failed to review grant')
            }
            const data = await response.json()
            console.log("Data : ", data)
            console.log("Score : ", data.score)
            console.log("Recommendation : ", data.recommendation)
            setScore(data.score)
            setRecommendation(data.recommendation)
        } catch (error) {
            setError("Failed to review grant")
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            {
                recommendation.length > 0 ? (
                    <div className="min-h-screen bg-background p-8">
                        <div className='flex flex-start'>
                            <HomeButton />
                        </div>
                        <div className="w-full max-w-5xl mx-auto px-6 sm:px-12">
                            <div className="flex flex-col gap-16 items-center justify-center mt-8">
                                <Card className="sm:w-64 w-full">
                                    <CardHeader>
                                        <CardTitle className="text-2xl font-bold text-center">Score :<br /><span className="text-green-500">{score}/100</span> </CardTitle>
                                    </CardHeader>
                                </Card>

                                <Card className="w-full">
                                    <CardHeader>
                                        <CardTitle className="flex flex-start font-bold">Recommendations</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ScrollArea className="min-h-[400px]">
                                            {recommendation.map((rec, index) => (
                                                <div key={index} className="mb-4 flex gap-2">
                                                    <span className="text-sm text-muted-foreground flex-shrink-0 mt-0.5">•</span>
                                                    <p className="text-sm text-muted-foreground  flex-1">{rec}</p>
                                                </div>
                                            ))}
                                        </ScrollArea>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-background h-screen p-8">
                        <div className='flex flex-start'>
                            <HomeButton />
                        </div>
                        <div className="w-full max-w-5xl mx-auto px-6 sm:px-12">
                            <div className="w-full flex flex-col gap-10  rounded-2xl  p-7">
                                <h1 className="text-center text-3xl md:text-4xl font-bold mb-2 tracking-wide text-foreground">
                                    Grant Reviewer
                                </h1>
                                <div className="flex flex-col gap-10 mt-5">
                                    <div>
                                        <Label className="mb-2">Upload Grant File</Label>
                                        <Input
                                            type="file"
                                            className="w-full flex items-center h-auto p-3 bg-card border border-border rounded-xl text-foreground file:cursor-pointer file:rounded-xl file:border-0 file:bg-gray-800 file:text-white file:py-2 file:px-4 file:text-sm file:transition-all hover:file:bg-gray-700"
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                    <div>
                                        <Label className="block mb-2">
                                            Grant Description
                                        </Label>
                                        <Textarea
                                            value={grantDescription}
                                            onChange={(e) => setGrantDescription(e.target.value)}
                                            required
                                            placeholder="Enter a detailed description"
                                            rows={5}
                                            className="textarea"
                                        />
                                    </div>
                                </div>
                                <div className="fixed inset-x-0 bottom-0 bg-secondary p-5 flex z-50 lg:px-96">
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={!grantDescription || !file}
                                        className={`large-button ${loading ? "cursor-not-allowed" : "cursor-pointer"}`}
                                    >
                                        {loading ? "Reviewing..." : "Submit"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                )
            }
        </>
    )


}