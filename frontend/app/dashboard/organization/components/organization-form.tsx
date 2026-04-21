"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, Save, Building2, AlertCircle, Check, Edit2 } from "lucide-react";
import { motion } from "framer-motion";

interface OrgData {
  organization_overview?: string;
  programs_and_key_activities?: string;
  impact_and_achievements?: string;
  past_projects_and_funding_experience?: string;
  team_and_leadership?: string;
  organizational_capacity_and_finance?: string;
  areas_of_operation?: string;
}

interface Organization {
  _id?: string;
  id?: string;
  name: string;
  org_data?: OrgData;
}

interface Props {
  initialData: Organization | null;
}

export default function OrganizationForm({ initialData }: Props) {
  const router = useRouter();

  // if no initial data, we're in creation mode
  const isNew = !initialData;

  const [isEditing, setIsEditing] = useState(isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [name, setName] = useState(initialData?.name || "");
  const [orgData, setOrgData] = useState<OrgData>(initialData?.org_data || {
    organization_overview: "",
    programs_and_key_activities: "",
    impact_and_achievements: "",
    past_projects_and_funding_experience: "",
    team_and_leadership: "",
    organizational_capacity_and_finance: "",
    areas_of_operation: "",
  });

  // Track which fields differ from their loaded initial values
  const [dirtyFields, setDirtyFields] = useState<Set<keyof OrgData>>(new Set());

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    setSuccess(false);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      const endpoint = `${baseUrl}/api/organization`;
      const method = isNew ? "POST" : "PUT";

      let payload: Record<string, unknown>;
      if (isNew) {
        payload = { name, org_data: orgData };
      } else {
        // Only send the fields that actually changed
        const changedData: Partial<OrgData> = {};
        dirtyFields.forEach(field => {
          changedData[field] = orgData[field];
        });
        payload = { org_data: changedData };
      }

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to commit organization record.");
      }

      const resData = await res.json();
      setSuccess(true);
      setDirtyFields(new Set()); // reset after successful save

      if (isNew && resData.organization) {
        // Now that the org is created, pushing to the dynamic route will trigger the skeleton & data fetch
        const newId = resData.organization._id || resData.organization.id;
        if (newId) {
          setTimeout(() => {
            router.push(`/dashboard/organization/${newId}`);
            router.refresh();
          }, 1500);
        }
      } else {
        setTimeout(() => setSuccess(false), 3000);
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (field: keyof OrgData, value: string) => {
    setOrgData(prev => ({ ...prev, [field]: value }));

    // Compare against the original loaded value to decide if field is dirty
    const initialValue = initialData?.org_data?.[field] ?? "";
    setDirtyFields(prev => {
      const next = new Set(prev);
      if (value !== initialValue) {
        next.add(field);
      } else {
        next.delete(field); // user reverted — no longer dirty
      }
      return next;
    });
  };

  const textareas = [
    { key: "organization_overview", label: "Organization Overview", placeholder: "General mission, history, and core objectives..." },
    { key: "programs_and_key_activities", label: "Programs & Key Activities", placeholder: "Detailed descriptions of main programmatic functions..." },
    { key: "impact_and_achievements", label: "Impact & Achievements", placeholder: "Quantifiable metrics, awards, and historical successes..." },
    { key: "past_projects_and_funding_experience", label: "Past Projects & Funding Experience", placeholder: "Historical grants, executed projects, and financial management track record..." },
    { key: "team_and_leadership", label: "Team & Leadership", placeholder: "Key personnel, board members, and organizational chart structure..." },
    { key: "organizational_capacity_and_finance", label: "Organizational Capacity & Finance", placeholder: "Annual budget summaries, fiscal sponsors, and operational capacity..." },
    { key: "areas_of_operation", label: "Areas of Operation", placeholder: "Geographic regions, target demographics, and local affiliations..." }
  ];

  return (
    <div className="max-w-4xl mx-auto pb-12 mt-8">
      <div className="mb-8 border-b-[2px] border-foreground pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Module Active</span>
            <div className="h-[2px] w-8 bg-primary" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-heading font-black leading-tight text-foreground">
            {isNew ? "Initialize" : "Modify"} <span className="italic font-light text-primary">Organization.</span>
          </h1>
          <p className="text-secondary font-sans leading-relaxed mt-4 max-w-xl">
            This foundational data drives all downstream AI generation and semantic matching modules. Keep it precise, comprehensive, and up-to-date.
          </p>
        </div>
        <div className="shrink-0 flex items-center justify-center w-16 h-16 border-[2px] border-foreground bg-primary text-primary-foreground shadow-[4px_4px_0px_0px_rgba(19,42,27,1)]">
          <Building2 className="h-8 w-8" />
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-12">
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="border-[2px] border-destructive bg-destructive/10 p-6 flex items-start gap-4">
            <AlertCircle className="h-6 w-6 text-destructive shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-sm font-bold uppercase tracking-widest text-destructive mb-1">System Error</span>
              <span className="text-foreground">{error}</span>
            </div>
          </motion.div>
        )}

        {success && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="border-[2px] border-primary bg-primary/10 p-6 flex items-start gap-4">
            <Check className="h-6 w-6 text-primary shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-sm font-bold uppercase tracking-widest text-primary mb-1">Update Confirmed</span>
              <span className="text-foreground">Organizational blueprint has been secured to the database.</span>
            </div>
          </motion.div>
        )}

        {/* Global Details Section */}
        <div className="border-[2px] border-foreground bg-background p-6 lg:p-8">
          <h2 className="text-xl font-heading font-black border-b-[2px] border-foreground/20 pb-4 mb-6">Global Descriptors</h2>
          <div className="space-y-6">
            <div className="group">
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground mb-3">
                <span className="w-2 h-2 bg-primary block" /> Primary Designation <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isNew}
                className="w-full px-4 h-14 border-[2px] border-foreground bg-transparent text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary transition-colors rounded-none disabled:bg-muted disabled:text-secondary disabled:cursor-not-allowed"
                placeholder="E.g. Global Health Initiative"
              />
              {!isNew && <p className="text-xs text-secondary mt-2 font-bold uppercase tracking-widest">Base designation cannot be intrinsically modified post-initialization.</p>}
            </div>
          </div>
        </div>

        {/* Dynamic Fields Section */}
        <div className="border-[2px] border-foreground bg-secondary/30 p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-[2px] border-foreground/20 pb-4 mb-6 gap-4">
            <h2 className="text-xl font-heading font-black">Structural Vectors (Optional)</h2>
            {!isNew && (
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setIsEditing(!isEditing);
                }}
                className={`rounded-none border-[2px] ${isEditing ? 'bg-primary text-primary-foreground border-foreground shadow-[2px_2px_0px_0px_rgba(19,42,27,1)]' : 'bg-background text-foreground border-foreground hover:bg-foreground hover:text-background'} font-bold tracking-widest uppercase text-xs h-10 px-4 transition-all`}
              >
                <Edit2 className="h-4 w-4 mr-2" />
                {isEditing ? 'Editing Mode Active' : 'Enable Editing'}
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 gap-10">
            {textareas.map((field) => (
              <div key={field.key} className="group flex flex-col">
                <label className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-foreground mb-3">
                  <span className="flex items-center gap-2"><span className="w-2 h-2 bg-foreground/30 group-focus-within:bg-primary transition-colors block" /> {field.label}</span>
                </label>
                <textarea
                  value={orgData[field.key as keyof OrgData] || ""}
                  onChange={(e) => updateField(field.key as keyof OrgData, e.target.value)}
                  disabled={!isEditing}
                  className="w-full p-4 min-h-[120px] border-[2px] border-foreground bg-background text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary transition-colors rounded-none resize-y disabled:bg-muted disabled:text-secondary disabled:cursor-not-allowed"
                  placeholder={field.placeholder}
                />
              </div>
            ))}
          </div>
        </div>

        {isEditing && (
          <div className="sticky bottom-8 z-20 flex justify-end">
            <Button
              type="submit"
              disabled={isSaving}
              className="h-16 px-10 rounded-none text-sm font-bold uppercase tracking-widest bg-primary text-primary-foreground hover:bg-foreground hover:text-background transition-all shadow-[8px_8px_0px_0px_rgba(19,42,27,1)] active:shadow-none active:translate-x-[8px] active:translate-y-[8px]"
            >
              {isSaving ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="animate-spin h-5 w-5" /> Encoding...
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  {isNew ? "Create Organization" : "Update Blueprint"} <Save className="h-5 w-5" />
                </div>
              )}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
