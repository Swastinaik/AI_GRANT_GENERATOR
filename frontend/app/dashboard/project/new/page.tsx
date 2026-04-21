"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, FileUp, AlertCircle, FileText } from "lucide-react";
import { motion } from "framer-motion";

export default function CreateProjectPage() {
  const router = useRouter();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("An RFP file is strictly required to initialize a project module.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("rfp", file);

      const res = await fetch(`${baseUrl}/api/project`, {
        method: "POST",
        credentials: "include",
        // Don't set Content-Type header manually when sending FormData, the browser will set it with the required boundary
        body: formData
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to initialize project module.");
      }

      const resData = await res.json();
      const newProjectId = resData.project._id || resData.project.id;
      
      if (newProjectId) {
        router.push(`/dashboard/project/${newProjectId}`);
      } else {
        throw new Error("Project generated but backend did not return a valid vector ID.");
      }

    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-12 mt-8">
      <div className="mb-8 border-b-[2px] border-foreground pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Module Execution</span>
            <div className="h-[2px] w-8 bg-primary" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-heading font-black leading-tight text-foreground">
            Initialize <span className="italic font-light text-primary">Project.</span>
          </h1>
          <p className="text-secondary font-sans leading-relaxed mt-4 max-w-xl">
            Upload the Request for Proposal (RFP) parameters to instantiate a new proposal sequence. Our semantic engines will automatically parse the requirements vector.
          </p>
        </div>
        <div className="shrink-0 flex items-center justify-center w-16 h-16 border-[2px] border-foreground bg-primary text-primary-foreground shadow-[4px_4px_0px_0px_rgba(19,42,27,1)]">
          <Plus className="h-8 w-8" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="border-[2px] border-destructive bg-destructive/10 p-6 flex items-start gap-4">
            <AlertCircle className="h-6 w-6 text-destructive shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-sm font-bold uppercase tracking-widest text-destructive mb-1">Initialization Error</span>
              <span className="text-foreground">{error}</span>
            </div>
          </motion.div>
        )}

        {/* Global Details Section */}
        <div className="border-[2px] border-foreground bg-background p-6 lg:p-8">
          <h2 className="text-xl font-heading font-black border-b-[2px] border-foreground/20 pb-4 mb-6">Metadata</h2>
          
          <div className="space-y-8">
            <div className="group">
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground mb-3">
                <span className="w-2 h-2 bg-primary block" /> Program Designation <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 h-14 border-[2px] border-foreground bg-transparent text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary transition-colors rounded-none"
                placeholder="E.g. NSF Cyberinfrastructure Advance Directive"
              />
            </div>

            <div className="group">
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground mb-3">
                <span className="w-2 h-2 bg-foreground/30 group-focus-within:bg-primary transition-colors block" /> Technical Abstract <span className="text-destructive">*</span>
              </label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-4 min-h-[120px] border-[2px] border-foreground bg-background text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary transition-colors rounded-none resize-y"
                placeholder="Brief summary of the intended proposal framework or specific objectives..."
              />
            </div>
          </div>
        </div>

        {/* RFP Upload Section */}
        <div className="border-[2px] border-foreground bg-secondary/30 p-6 lg:p-8">
          <h2 className="text-xl font-heading font-black border-b-[2px] border-foreground/20 pb-4 mb-6">Requirements Vector (RFP)</h2>
          
          <div className="relative">
             <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setFile(e.target.files[0]);
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className={`border-[2px] flex flex-col items-center justify-center p-12 transition-all ${file ? 'border-primary bg-primary/5' : 'border-dashed border-foreground/40 bg-background hover:bg-muted'}`}>
                 {file ? (
                   <>
                     <div className="w-16 h-16 border-[2px] border-primary bg-background flex items-center justify-center mb-4 shadow-[4px_4px_0px_0px_rgba(224,87,62,1)]">
                       <FileText className="h-8 w-8 text-primary" />
                     </div>
                     <span className="font-bold text-foreground text-center">Payload Attached</span>
                     <span className="text-xs font-bold uppercase tracking-widest text-primary mt-2">{file.name}</span>
                   </>
                 ) : (
                   <>
                     <div className="w-12 h-12 flex items-center justify-center bg-foreground text-background mb-4 rounded-full">
                       <FileUp className="h-6 w-6" />
                     </div>
                     <span className="font-bold text-foreground">Mount File System</span>
                     <span className="text-sm text-secondary mt-1 text-center">Drag and drop or click to inject PDF requirements</span>
                   </>
                 )}
              </div>
          </div>
        </div>

        <div className="sticky bottom-8 z-20 flex justify-end">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="h-16 px-10 rounded-none text-sm font-bold uppercase tracking-widest bg-primary text-primary-foreground hover:bg-foreground hover:text-background transition-all shadow-[8px_8px_0px_0px_rgba(19,42,27,1)] active:shadow-none active:translate-x-[8px] active:translate-y-[8px]"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-3">
                <Loader2 className="animate-spin h-5 w-5" /> Submitting Vector...
              </div>
            ) : (
              <div className="flex items-center gap-3">
                Initialize Project Module <Plus className="h-5 w-5" />
              </div>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
