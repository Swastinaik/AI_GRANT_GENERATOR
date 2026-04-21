import { FileText, Clock, ExternalLink } from "lucide-react";

// Simulated fetch with a 2-second delay to showcase Suspense boundary
async function getRecentHistory() {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  
  return [
    {
      id: "PRJ-902",
      title: "NSF Advanced Computing Infrastructure",
      agency: "National Science Foundation",
      status: "Analyzing",
      date: "2h ago",
    },
    {
      id: "PRJ-881",
      title: "NIH Postdoctoral Fellowship",
      agency: "National Institutes of Health",
      status: "Drafted",
      date: "Yesterday",
    },
    {
      id: "PRJ-842",
      title: "DOE Clean Energy Innovation Fund",
      agency: "Department of Energy",
      status: "Completed",
      date: "Mar 14",
    },
  ];
}

export async function RecentHistory() {
  const history = await getRecentHistory();

  return (
    <div className="flex flex-col gap-4">
      {history.map((item, i) => (
        <div 
          key={item.id} 
          className="border-[2px] border-foreground bg-background p-5 hover:bg-muted transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group cursor-pointer shadow-[4px_4px_0px_0px_rgba(19,42,27,0.1)] hover:shadow-[4px_4px_0px_0px_rgba(19,42,27,1)]"
        >
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-10 h-10 border-[2px] border-foreground flex items-center justify-center shrink-0 bg-secondary text-secondary-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{item.id}</span>
                <span className="text-foreground/30">•</span>
                <div className="flex items-center gap-1 text-foreground/50 text-[10px] uppercase font-bold tracking-widest">
                  <Clock className="h-3 w-3" />
                  {item.date}
                </div>
              </div>
              <h4 className="font-bold text-foreground leading-tight">{item.title}</h4>
              <p className="text-sm text-secondary mt-1">{item.agency}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 sm:flex-col sm:items-end">
            <span className={`text-xs font-bold uppercase tracking-widest px-2 py-1 border-[2px] border-foreground ${
              item.status === 'Completed' ? 'bg-[#132A1B] text-[#F8F5EE]' : 
              item.status === 'Analyzing' ? 'bg-[#e0573e] text-[#F8F5EE]' : 
              'bg-transparent text-foreground'
            }`}>
              {item.status}
            </span>
            <ExternalLink className="h-4 w-4 text-foreground/40 group-hover:text-foreground transition-colors hidden sm:block" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function RecentHistorySkeleton() {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="border-[2px] border-foreground/20 bg-muted/50 p-5 h-[104px] flex items-center justify-between">
          <div className="flex items-center gap-4 w-full">
            <div className="w-10 h-10 border-[2px] border-foreground/10 bg-foreground/5 shrink-0" />
            <div className="w-full max-w-sm space-y-2">
              <div className="h-3 w-24 bg-foreground/10" />
              <div className="h-5 w-full bg-foreground/10" />
              <div className="h-3 w-48 bg-foreground/10" />
            </div>
          </div>
          <div className="h-6 w-24 bg-foreground/10 hidden sm:block" />
        </div>
      ))}
    </div>
  );
}
