"use client";

import { useEffect, useState } from "react";
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import BackButton from "@/app/components/BackButton";
import { Label } from "@/components/ui/label";
import { Loader2, Download } from "lucide-react";
import useAuthStore from "@/app/store/AuthStore";
import { fetchWithAuth } from "@/app/lib/api";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function PodcastPage() {
  const [userInput, setUserInput] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null)
  const accessToken = useAuthStore((state) => state.accessToken)
  const setAccessToken = useAuthStore((state) => state.setAccessToken)


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setFile(files[0])
    }
  };

  // Clean up old blob URLs
  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const handleGenerate = async () => {
    if (!accessToken) {
      return
    }
    if (!userInput.trim() && !file) {
      setError("Please enter a topic or upload a file.");
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      // Revoke previous URL if any
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
      }
      const formData = new FormData()
      if(file){
        formData.append("file", file)
      }
      else if(userInput){
        formData.append("user_input", userInput)
      }

      const response = await fetchWithAuth(
        `${API_BASE_URL}/generate-podcast`,
        {
          method: "POST",
          body: formData,
        },
        accessToken,
        setAccessToken
      );

      if (!response.ok || !response.body) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const reader = response.body.getReader();
      const chunks: Uint8Array[] = [];
      let totalLength = 0;

      // Read streamed audio into memory
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          chunks.push(value);
          totalLength += value.length;
        }
      }

    

      const blob = new Blob(chunks as unknown as BlobPart[], { type: "audio/wav" });
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (err: any) {
      console.error("Error generating podcast:", err);
      setError(err?.message ?? "Failed to generate podcast.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Top bar / header */}
      <header className="border-b">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold tracking-tight">
            AI Podcast Studio
          </h1>
          <span className="text-xs text-muted-foreground">
            Powered by FastAPI · Gemini TTS
          </span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">

        <div className="mx-auto max-w-5xl px-4 py-8 space-y-8">

          {/* Input section */}
          <section className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="user-input" className="text-sm font-medium">
                Topic / Prompt
              </Label>
              <Textarea
                id="user-input"
                rows={5}
                placeholder="e.g. Explain the basics of REST APIs for complete beginners, with analogies and real-world examples."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="resize-none text-sm"
              />
            </div>
            <p className="text-secondary-foreground w-full text-center">or</p>
            <div>
              <Label className="mb-2">File Uploader</Label>
              <Input
                type="file"
                className="w-full flex items-center h-auto p-3 bg-card border border-border rounded-xl text-foreground file:cursor-pointer file:rounded-xl file:border-0 file:bg-gray-800 file:text-white file:py-2 file:px-4 file:text-sm file:transition-all hover:file:bg-gray-700"
                onChange={handleFileChange}
              />
            </div>

            {error && (
              <p className="text-sm text-red-500">
                {error}
              </p>
            )}

            <div className="flex justify-between">
              <BackButton />
              <Button onClick={handleGenerate} disabled={isLoading} className="cursor-pointer">
                {isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isLoading ? "Generating podcast..." : "Generate podcast"}
              </Button>
            </div>
          </section>

          {/* Full-page style preview section */}
          <section className="mt-4 border rounded-xl bg-muted/40 p-6 min-h-[260px] flex flex-col justify-center">
            {!audioUrl && !isLoading && (
              <div className="text-center text-sm text-muted-foreground">
                Your generated podcast will appear here.
                <br />
                Enter a topic above and click{" "}
                <span className="font-semibold">Generate podcast</span>.
              </div>
            )}

            {isLoading && (
              <div className="flex flex-col items-center justify-center gap-3 text-sm text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin" />
                <p>Generating your educational podcast… this might take a moment.</p>
              </div>
            )}

            {audioUrl && !isLoading && (
              <div className="flex flex-col gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    Preview
                  </p>
                  <audio
                    controls
                    src={audioUrl}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <p className="text-xs text-muted-foreground">
                    Tip: You can keep this page open and generate another episode
                    with a different topic.
                  </p>
                  <a
                    href={audioUrl}
                    download="podcast.wav"
                    className="inline-flex items-center gap-2 text-xs font-medium underline hover:no-underline"
                  >
                    <Download className="h-4 w-4" />
                    Download podcast
                  </a>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
