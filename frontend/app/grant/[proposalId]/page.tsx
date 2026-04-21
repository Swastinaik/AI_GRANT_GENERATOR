import { Suspense } from "react";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { GrantViewer } from "./client-page";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

async function getProposalData(proposalId: string) {
  const cookieStore = await cookies();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  try {
    const res = await fetch(`${baseUrl}/api/proposal/${proposalId}`, {
      headers: {
        Cookie: cookieStore.toString()
      },
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Failed to fetch proposal: HTTP ${res.status}`);
    }

    const data = await res.json();
    return data.proposal || null;
  } catch (error) {
    console.error("Proposal fetch error:", error);
    return null;
  }
}

export default async function GrantPage({ params }: { params: Promise<{ proposalId: string }> }) {
  const resolvedParams = await params;
  const proposalId = resolvedParams.proposalId;

  const proposal = await getProposalData(proposalId);

  if (!proposal) {
    notFound();
  }

  return (
    <div className="w-full h-screen flex flex-col bg-background">
      {/* Header slightly adjusted for viewer context */}
      <div className="px-6 py-4 border-b-[2px] border-foreground bg-background flex items-center justify-between shrink-0">
         <div className="flex items-center gap-6">
           <Link href={`/dashboard/project/${proposal.project_id}`} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground hover:text-primary transition-colors border-[2px] border-transparent hover:border-foreground px-3 py-1.5">
             <ArrowLeft className="h-4 w-4" /> Back to Project
           </Link>
           <div className="flex items-center gap-3">
             <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-primary text-primary-foreground border-[2px] border-foreground">DRAFT V1</span>
             <div className="h-4 w-[2px] bg-foreground/20" />
             <span className="text-xs font-bold font-mono tracking-widest text-secondary uppercase">ID: {proposalId}</span>
           </div>
         </div>
      </div>

      <div className="flex-1 w-full overflow-hidden">
         <Suspense fallback={
            <div className="h-full w-full flex items-center justify-center">
              <div className="flex flex-col items-center gap-4 text-primary">
                 <Loader2 className="h-8 w-8 animate-spin" />
                 <span className="font-bold text-xs uppercase tracking-widest">Parsing Structure Matrix...</span>
              </div>
            </div>
         }>
            <GrantViewer proposal={proposal} />
         </Suspense>
      </div>
    </div>
  );
}
