import { Suspense } from "react";
import { cookies } from "next/headers";
import Link from "next/link";
import { FolderGit2, Plus, ArrowRight, FolderOpen, Calendar } from "lucide-react";

interface Project {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  created_at?: string;
}

async function getProjects() {
  const cookieStore = await cookies();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  try {
    const res = await fetch(`${baseUrl}/api/project`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 404) return [];
      throw new Error(`Failed to fetch projects: HTTP ${res.status}`);
    }

    const data = await res.json();
    return (data.projects || []) as Project[];
  } catch (error) {
    console.error("Projects list fetch error:", error);
    return [];
  }
}

export default async function ProjectsDirectoryPage() {
  const projects = await getProjects();

  return (
    <div className="max-w-6xl mx-auto pb-12 mt-4">
      <div className="mb-8 border-b-[2px] border-foreground pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Global Directory</span>
            <div className="h-[2px] w-8 bg-primary" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-heading font-black leading-tight text-foreground">
            Project <span className="italic font-light text-primary">Modules.</span>
          </h1>
          <p className="text-secondary font-sans leading-relaxed mt-4 max-w-xl">
            Access your established generation pipelines or mount a new RFP sequence. 
          </p>
        </div>
        <Link 
          href="/dashboard/project/new"
          className="shrink-0 flex items-center justify-center gap-3 h-16 px-8 border-[2px] border-foreground bg-primary text-primary-foreground font-bold tracking-widest uppercase text-sm shadow-[6px_6px_0px_0px_rgba(19,42,27,1)] hover:bg-foreground hover:text-background transition-all active:shadow-none active:translate-x-[6px] active:translate-y-[6px]"
        >
          New Module <Plus className="h-5 w-5" />
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="border-[2px] border-foreground border-dashed bg-background/50 p-12 flex flex-col items-center justify-center text-center mt-8">
          <FolderOpen className="h-12 w-12 text-secondary mb-4 opacity-50" />
          <h3 className="font-heading font-black text-2xl mb-2 text-foreground">No Projects Instantiated</h3>
          <p className="text-secondary font-sans max-w-sm mb-6">
            You haven't initialized any grant proposal pipelines yet. Create a new module to begin processing an RFP.
          </p>
          <Link 
            href="/dashboard/project/new"
            className="border-[2px] border-foreground bg-background text-foreground font-bold tracking-widest uppercase text-xs px-6 py-3 hover:bg-primary hover:text-primary-foreground transition-colors inline-block"
          >
            Create First Project
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {projects.map((project, i) => {
            const pid = project._id || project.id;
            const dateStr = project.created_at 
              ? new Date(project.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
              : 'Unknown Date';

            return (
              <Link 
                key={pid || i}
                href={`/dashboard/project/${pid}`}
                className="group relative flex flex-col justify-between border-[2px] border-foreground bg-background p-6 lg:p-8 transition-all hover:bg-muted shadow-[4px_4px_0px_0px_rgba(19,42,27,0.1)] hover:shadow-[8px_8px_0px_0px_rgba(19,42,27,1)] hover:-translate-y-1 block h-full flex flex-col"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 border-[2px] border-foreground flex items-center justify-center bg-primary/10 text-primary">
                      <FolderGit2 className="h-5 w-5" />
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-secondary group-hover:text-primary transition-colors">
                      <Calendar className="h-3 w-3" />
                      {dateStr}
                    </div>
                  </div>
                  
                  <h3 className="font-heading font-black text-2xl uppercase tracking-wide text-foreground mb-3 leading-tight line-clamp-2">
                    {project.title}
                  </h3>
                  
                  <p className="text-sm border-l-[2px] border-primary/50 pl-3 font-sans text-secondary line-clamp-3 mb-6">
                    {project.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t-[2px] border-foreground/10 mt-auto">
                   <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-foreground/50 truncate w-32">
                     ID: {String(pid).substring(0,8)}...
                   </span>
                   <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground group-hover:text-primary transition-colors">
                     Access Matrix <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                   </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
