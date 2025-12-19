import { FileText, Layers, Cpu, Download } from "lucide-react";
export const GrantAgent = {
    slug: "grant-writer",
    name: "Grant Generation Agent",
    description:
      "Generate complete grant proposals using organizational context and parallel AI workflows.",
    icon: <FileText className="h-5 w-5" />,
    sections: [
      {
        id: "overview",
        title: "Overview",
        content: (
          <p>
            The Grant Generation Agent helps nonprofits and organizations
            generate high-quality, funder-ready grant proposals by deeply
            understanding organizational history and project intent.
          </p>
        ),
      },
      {
        id: "workflow",
        title: "How It Works",
        content: (
          <ol className="list-decimal pl-6 space-y-2">
            <li>Upload organizational documents</li>
            <li>Provide section-specific inputs</li>
            <li>AI summarizes organizational context</li>
            <li>Parallel AI agents generate grant sections</li>
            <li>Edit, refine, and export using templates</li>
          </ol>
        ),
      },
      {
        id: "architecture",
        title: "System Architecture",
        content: (
          <ul className="list-disc pl-6 space-y-2">
            <li>FastAPI backend with async task orchestration</li>
            <li>AI summarization layer for organization context</li>
            <li>Parallel LLM calls for each grant section</li>
            <li>Central editor with version control</li>
          </ul>
        ),
      },
      {
        id: "parallel",
        title: "Parallel Section Generation",
        content: (
          <p>
            Each grant section (Executive Summary, Budget, Cover Letter, etc.)
            is generated asynchronously, reducing overall generation time by
            up to 60% while maintaining contextual consistency.
          </p>
        ),
      },
      {
        id: "export",
        title: "Editing & Export",
        content: (
          <p>
            Generated grants are displayed in a rich editor where users can
            modify content and export final documents using predefined,
            funder-friendly templates.
          </p>
        ),
      },
    ],
  }