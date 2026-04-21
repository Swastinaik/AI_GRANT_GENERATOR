import { FileText, Clock, ExternalLink, Activity } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";

interface Proposal {
  _id?: string;
  id?: string;
  file_url?: string;
  type: string;
  review?: string;
  project_id: string;
  created_at?: string;
}

export async function ProposalsList({ projectId }: { projectId: string }) {
  const cookieStore = await cookies();


  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // Artificial delay to exhibit the suspense skeleton


  let proposals: Proposal[] = [];

  try {
    const res = await fetch(`${baseUrl}/api/proposal/project/${projectId}`, {
      headers: {
        Cookie: cookieStore.toString()
      },
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      console.log(data)
      proposals = data.proposals || [];
    }
  } catch (err) {
    console.error("Failed to fetch proposals", err);
  }

  if (proposals.length === 0) {
    return (
      <div className="border-[2px] border-foreground border-dashed bg-background/50 p-12 flex flex-col items-center justify-center text-center mt-8">
        <Activity className="h-10 w-10 text-secondary mb-4 opacity-50" />
        <h3 className="font-heading font-black text-xl mb-2 text-foreground">No Generated Instances</h3>
        <p className="text-secondary font-sans max-w-sm">
          Awaiting execution of generation sequences. Initiate the payload above to establish the first proposal draft.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 mt-8">
      {proposals.map((item, i) => (
        <div
          key={item._id || item.id || i}
          className="border-[2px] border-foreground bg-background p-6 hover:bg-muted transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-6 group shadow-[4px_4px_0px_0px_rgba(19,42,27,0.1)] hover:shadow-[4px_4px_0px_0px_rgba(19,42,27,1)]"
        >
          <div className="flex items-start sm:items-center gap-5">
            <div className="w-12 h-12 border-[2px] border-foreground flex items-center justify-center shrink-0 bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">ID: {String(item._id || item.id).substring(0, 8)}</span>
                <span className="text-foreground/30">•</span>
                <div className="flex items-center gap-1 text-foreground/50 text-[10px] uppercase font-bold tracking-widest">
                  <Clock className="h-3 w-3" />
                  {item.created_at ? new Date(item.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Deployed'}
                </div>
              </div>
              <h4 className="font-bold text-lg text-foreground leading-tight uppercase font-heading tracking-wide">
                Module Array: {item.type}
              </h4>
              <p className="text-sm text-secondary mt-1">Ready for systematic review or export.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">


            <Link href={`/grant/${item._id || item.id}`} className="text-xs font-bold uppercase tracking-widest bg-foreground text-background px-4 py-2 hover:bg-primary transition-colors flex items-center gap-2 border-[2px] border-transparent hover:border-foreground">
              Access <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
