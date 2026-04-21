"use client";

import { useState } from "react";
import { Download, Save, MessageSquare, Menu, FileText, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { convertServerPatchToFullTree } from "next/dist/client/components/segment-cache/navigation";

export function GrantViewer({ proposal }: { proposal: any }) {
  // Try to safely extract the actual sections to display
  // Usually if generated via graph, it's in output_json.sections
  const outputJson = proposal?.output_json || {};
  let sectionsObj = outputJson.sections || outputJson;


  // If it's a string, try parsing it
  if (typeof sectionsObj === 'string') {
    try {
      sectionsObj = JSON.parse(sectionsObj);
    } catch (e) {
      // Fallback if not parsable
      sectionsObj = { Content: sectionsObj };
    }
  }

  // Filter out non-object keys if we have graph state
  const sectionKeys = Object.keys(sectionsObj).filter(k =>
    k !== "user_input" && k !== "orgId" && k !== "default_section" && k !== "rfp_constraints"
  );

  const [activeSection, setActiveSection] = useState(sectionKeys[0] || "");
  const [contentMap, setContentMap] = useState<Record<string, any>>(() => {
    const map: Record<string, any> = {};
    for (const key of sectionKeys) {
      const val = sectionsObj[key];

      map[key] = val
    }

    return map;
  });

  const handleContentChange = (val: string) => {
    setContentMap(prev => ({ ...prev, [activeSection]: { content: val } }));
  };

  const handleSave = async () => {
    // Save functionality placeholder
    console.log("Saving...", contentMap);
    alert("Save logic pending endpoint integration");
  };

  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const payload: Record<string, string> = {};
      Object.keys(contentMap).forEach((key) => {
        // extract the string content
        payload[key] = contentMap[key]?.content[0]?.text || "";
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/proposal/download`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to download document");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "grant_proposal.docx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export error:", error);
      alert("Failed to export the document.");
    } finally {
      setIsExporting(false);
    }
  };

  const formatSectionName = (name: string) => {
    return name.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  };

  return (
    <div className="flex h-full w-full max-w-[1600px] mx-auto gap-6 p-6">

      {/* LEFT COLUMN: Sections Navigation */}
      <div className="w-1/5 flex flex-col border-[2px] border-foreground bg-background overflow-hidden relative shadow-[4px_4px_0px_0px_rgba(19,42,27,1)]">
        <div className="p-4 border-b-[2px] border-foreground bg-primary/10 flex items-center gap-2">
          <Menu className="h-5 w-5 text-primary" />
          <h2 className="font-heading font-black tracking-wide uppercase text-sm">Sections</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
          {sectionKeys.length === 0 ? (
            <div className="text-secondary text-sm p-2">No sections found in payload.</div>
          ) : (
            sectionKeys.map((key) => {
              const isActive = activeSection === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveSection(key)}
                  className={`text-left w-full p-4 border-[2px] transition-all flex items-start gap-3
                    ${isActive
                      ? "border-primary bg-primary text-primary-foreground shadow-[2px_2px_0px_0px_rgba(19,42,27,1)] -translate-y-[2px]"
                      : "border-transparent hover:border-foreground hover:bg-muted"
                    }
                  `}
                >
                  <FileText className={`h-4 w-4 mt-0.5 shrink-0 ${isActive ? "text-primary-foreground" : "text-secondary"}`} />
                  <span className={`text-xs font-bold uppercase tracking-wide leading-tight ${isActive ? "text-primary-foreground" : "text-foreground"}`}>
                    {formatSectionName(key)}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* MIDDLE COLUMN: Editor */}
      <div className="flex-1 flex flex-col border-[2px] border-foreground bg-background relative shadow-[8px_8px_0px_0px_rgba(19,42,27,1)]">
        <div className="p-5 border-b-[2px] border-foreground bg-secondary/10 flex items-center justify-between">
          <h2 className="font-heading font-black text-xl text-foreground">
            {activeSection ? formatSectionName(activeSection) : "Editor"}
          </h2>
          <Button
            onClick={handleSave}
            className="rounded-none border-[2px] border-foreground bg-primary text-primary-foreground hover:bg-foreground hover:text-background font-bold tracking-widest uppercase text-xs h-10 px-6 shadow-[2px_2px_0px_0px_rgba(19,42,27,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
          >
            <Save className="h-4 w-4 mr-2" /> Save Content
          </Button>
        </div>

        <div className="flex-1 p-0 relative">
          <textarea
            value={contentMap[activeSection]?.content[0]?.text || ""}
            onChange={(e) => handleContentChange(e.target.value)}
            className="w-full h-full p-8 resize-none focus:outline-none bg-transparent text-foreground font-sans leading-relaxed styling-scrollbar"
            placeholder="Section content..."
          />
        </div>
      </div>

      {/* RIGHT COLUMN: Chatbot & Tools */}
      <div className="w-1/4 flex flex-col gap-6">
        {/* Chatbot Interface */}
        <div className="flex-1 flex flex-col border-[2px] border-foreground bg-background shadow-[4px_4px_0px_0px_rgba(19,42,27,1)] overflow-hidden">
          <div className="p-4 border-b-[2px] border-foreground bg-secondary/10 flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <span className="font-bold text-xs uppercase tracking-widest text-foreground">AI Co-Pilot</span>
          </div>

          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center bg-muted/30">
            <MessageSquare className="h-10 w-10 text-secondary mb-4 opacity-50" />
            <h3 className="font-heading font-black text-lg mb-2">Chatbot Offline</h3>
            <p className="text-sm font-sans text-secondary">
              Review model integration pending. You will soon be able to refine this section interactively.
            </p>
          </div>

          <div className="p-4 border-t-[2px] border-foreground bg-background">
            <div className="border-[2px] border-foreground p-3 flex bg-muted/50 cursor-not-allowed opacity-50">
              <span className="text-secondary text-sm font-sans">Ask a formatting question...</span>
            </div>
          </div>
        </div>

        {/* Global Actions */}
        <div className="border-[2px] border-foreground bg-primary p-6 shadow-[4px_4px_0px_0px_rgba(19,42,27,1)]">
          <h3 className="text-primary-foreground font-heading font-black text-lg mb-4">Export Pipeline</h3>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className={`w-full flex items-center justify-center gap-2 border-[2px] border-foreground text-foreground h-12 font-bold text-xs uppercase tracking-widest transition-colors ${isExporting
              ? "bg-muted cursor-wait opacity-80"
              : "bg-background hover:bg-muted opacity-100"
              }`}
          >
            <Download className="h-4 w-4" /> {isExporting ? "Exporting..." : "Export Document Payload"}
          </button>
        </div>
      </div>

    </div>
  );
}
