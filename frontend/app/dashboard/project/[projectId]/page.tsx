import { Suspense } from "react";
import { cookies } from "next/headers";
import Link from "next/link";
import { ProposalsList } from "../components/proposals-list";
import { ProposalsSkeleton } from "../components/proposals-skeleton";
import { BrainCircuit, CheckSquare, FolderGit2, AlertCircle } from "lucide-react";
import { notFound } from "next/navigation";

async function getProjectData(projectId: string) {
  const cookieStore = await cookies();

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  try {
    const res = await fetch(`${baseUrl}/api/project/${projectId}`, {
      headers: {
        Cookie: cookieStore.toString()
      },
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Failed to fetch project: HTTP ${res.status}`);
    }

    const data = await res.json();
    return data.project || null;
  } catch (error) {
    console.error("Project fetch error:", error);
    return null;
  }
}

export default async function ProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const resolvedParams = await params;
  const projectId = resolvedParams.projectId;

  const project = await getProjectData(projectId);

  if (!project) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto pb-12 mt-4">
      {/* Top Details Section */}
      <section className="flex flex-col md:flex-row gap-8 items-start justify-between border-b-[2px] border-foreground pb-8 mb-8">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Project Directory</span>
            <div className="h-[2px] w-8 bg-primary" />
            <span className="text-xs font-bold font-mono tracking-widest text-foreground/50">{projectId}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-heading font-black leading-tight text-foreground mb-4 relative inline-block">
            {project.title}
            {/* Architectural top-right accent */}
            <div className="absolute -top-2 -right-6 w-3 h-3 bg-primary" />
          </h1>
          <p className="text-secondary font-sans leading-relaxed text-lg bg-secondary/10 p-4 border-l-[2px] border-primary">
            {project.description}
          </p>
        </div>

        <div className="shrink-0 flex items-center justify-center p-6 border-[2px] border-foreground bg-primary/5">
          <FolderGit2 className="h-12 w-12 text-primary" />
        </div>
      </section>

      {/* Control Surface */}
      <section className="mb-16">
        <h2 className="text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-primary inline-block" /> Execution Protocols
        </h2>

        <div className="grid sm:grid-cols-2 gap-6">
          <Link href={`/dashboard/project/${projectId}/grant-generation`} className="group relative flex flex-col items-start gap-4 bg-background border-[2px] border-foreground p-8 transition-all hover:bg-foreground hover:text-background shadow-[6px_6px_0px_0px_rgba(19,42,27,1)] active:shadow-none active:translate-x-[6px] active:translate-y-[6px]">
            <div className="flex items-center justify-between w-full">
              <div className="w-12 h-12 border-[2px] border-foreground rounded-full flex items-center justify-center group-hover:border-background group-hover:bg-background group-hover:text-foreground transition-all">
                <BrainCircuit className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest font-mono border-[1px] border-foreground group-hover:border-background px-2 py-1">SYS.GEN</span>
            </div>
            <div>
              <h3 className="font-heading font-black text-2xl uppercase tracking-wide mb-2">Generate Pipeline</h3>
              <p className="text-sm font-sans text-secondary group-hover:text-background/80 transition-colors">
                Initiate multi-agent inference via the RFP vector matrix. This will cost 1 Generation Quota.
              </p>
            </div>
          </Link>

          <button className="group relative flex flex-col items-start gap-4 bg-primary text-primary-foreground border-[2px] border-foreground p-8 transition-all hover:bg-foreground hover:text-background shadow-[6px_6px_0px_0px_rgba(19,42,27,1)] active:shadow-none active:translate-x-[6px] active:translate-y-[6px]">
            <div className="flex items-center justify-between w-full">
              <div className="w-12 h-12 border-[2px] border-foreground bg-background text-foreground rounded-full flex items-center justify-center transition-all">
                <CheckSquare className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest font-mono border-[1px] border-foreground px-2 py-1 bg-background text-foreground">SYS.REV</span>
            </div>
            <div>
              <h3 className="font-heading font-black text-2xl uppercase tracking-wide mb-2">Review Grants</h3>
              <p className="text-sm font-sans text-background/80 transition-colors">
                Deploy evaluative critique models against the previously generated drafts to enforce rigorous compliance.
              </p>
            </div>
          </button>
        </div>
      </section>

      {/* Generated Instances Section */}
      <section>
        <div className="flex items-end justify-between border-b-[2px] border-foreground/20 pb-4">
          <h2 className="text-2xl font-heading font-black uppercase tracking-wide">
            Generated Datasets
          </h2>
        </div>

        <Suspense fallback={<ProposalsSkeleton />}>
          <ProposalsList projectId={projectId} />
        </Suspense>

      </section>
    </div>
  );
}
