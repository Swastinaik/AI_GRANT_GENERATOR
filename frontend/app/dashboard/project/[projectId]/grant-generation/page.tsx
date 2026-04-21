"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, AlertCircle, FilePlus2, ServerCrash } from "lucide-react";
import { motion } from "framer-motion";

export default function GrantGenerationPage({ params }: { params: Promise<{ projectId: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const projectId = resolvedParams.projectId;




  const [formData, setFormData] = useState({
    problem_statement: "",
    target_beneficiaries: "",
    goals_and_objectives: "",
    impact: "",
    methodology: "",
    timeline: "",
    budget: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch orgId for the payload requirement
    if (!projectId) {
      router.push("/dashboard/project/new")
    }
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();


    setIsSubmitting(true);
    setError("");

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      const payloadData = new FormData();
      payloadData.append("project_id", projectId);
      payloadData.append("user_input", JSON.stringify(formData));

      const res = await fetch(`${baseUrl}/api/grant-proposal`, {
        method: "POST",
        credentials: "include",
        body: payloadData
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to initiate graph execution. Backend constraint failed.");
      }

      const resData = await res.json();
      const newGrantId = resData._id || resData.id;

      if (newGrantId) {
        router.push(`/grant/${newGrantId}`);
      } else {
        // Fallback: If for some reason we don't get the ID back right away, return to project.
        router.push(`/dashboard/project/${projectId}`);
      }

    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  const formFields = [
    { key: "problem_statement", label: "Problem Statement", placeholder: "Detail the specific issue this proposal addresses..." },
    { key: "target_beneficiaries", label: "Target Beneficiaries", placeholder: "Identify the primary demographics or entities impacted..." },
    { key: "goals_and_objectives", label: "Goals & Objectives", placeholder: "Outline the core directives and success criteria..." },
    { key: "impact", label: "Projected Impact", placeholder: "Predict the overarching societal, technical, or specific value added..." },
    { key: "methodology", label: "Methodology", placeholder: "Explain the systematic approach to achieving the stated directives..." },
    { key: "timeline", label: "Timeline", placeholder: "Propose temporal constraints and milestone mapping..." },
    { key: "budget", label: "Budget Constraints", placeholder: "Financial modeling and capital allocation required..." },
  ];

  return (
    <div className="max-w-4xl mx-auto pb-12 mt-8">
      <div className="mb-8 border-b-[2px] border-foreground pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Inference Trigger</span>
            <div className="h-[2px] w-8 bg-primary" />
            <span className="text-xs font-bold font-mono tracking-widest text-foreground/50">{projectId}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-heading font-black leading-tight text-foreground">
            Generate <span className="italic font-light text-primary">Proposal.</span>
          </h1>
          <p className="text-secondary font-sans leading-relaxed mt-4 max-w-xl">
            Input localized parameters for the multi-agent orchestration. The RFP constraints will be loaded automatically from the parent module.
          </p>
        </div>
        <div className="shrink-0 flex items-center justify-center w-16 h-16 border-[2px] border-foreground bg-primary text-primary-foreground shadow-[4px_4px_0px_0px_rgba(19,42,27,1)]">
          <FilePlus2 className="h-8 w-8" />
        </div>
      </div>



      <form onSubmit={handleSubmit} className="space-y-10">
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="border-[2px] border-destructive bg-destructive/10 p-6 flex items-start gap-4">
            <AlertCircle className="h-6 w-6 text-destructive shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-sm font-bold uppercase tracking-widest text-destructive mb-1">Execution Error</span>
              <span className="text-foreground">{error}</span>
            </div>
          </motion.div>
        )}

        <div className="border-[2px] border-foreground bg-background p-6 lg:p-8 space-y-8">
          <h2 className="text-xl font-heading font-black border-b-[2px] border-foreground/20 pb-4 mb-6">User Intrinsic Parameters</h2>

          <div className="grid grid-cols-1 gap-8">
            {formFields.map(({ key, label, placeholder }) => (
              <div key={key} className="group">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground mb-3">
                  <span className="w-2 h-2 bg-foreground/30 group-focus-within:bg-primary transition-colors block" /> {label} <span className="text-destructive">*</span>
                </label>
                <textarea
                  required
                  value={formData[key as keyof typeof formData]}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="w-full p-4 min-h-[100px] border-[2px] border-foreground bg-background text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary transition-colors rounded-none resize-y"
                  placeholder={placeholder}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="sticky bottom-8 z-20 flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-16 px-10 rounded-none text-sm font-bold uppercase tracking-widest bg-primary text-primary-foreground hover:bg-foreground hover:text-background transition-all shadow-[8px_8px_0px_0px_rgba(19,42,27,1)] active:shadow-none active:translate-x-[8px] active:translate-y-[8px] disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-3">
                <Loader2 className="animate-spin h-5 w-5" /> Orchestrating Graph...
              </div>
            ) : (
              <div className="flex items-center gap-3">
                Commence Generation <Plus className="h-5 w-5" />
              </div>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
