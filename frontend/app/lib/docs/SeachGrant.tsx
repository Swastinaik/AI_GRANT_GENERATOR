import { Search } from "lucide-react";

export const SearchGrant = {
  slug: "grant-search",
  name: "Grant Search & Ranking Agent",
  description:
    "Search, analyze, and rank grants from grants.gov using semantic matching and AI-powered relevance scoring.",
  icon: <Search className="h-5 w-5" />,
  sections: [

    // -------------------- OVERVIEW --------------------
    {
      id: "overview",
      title: "Overview",
      content: (
        <>
          <p>
            The Grant Search & Ranking Agent enables organizations to discover
            the most relevant funding opportunities by intelligently searching
            grants from <strong>grants.gov</strong> and ranking them based on
            semantic alignment with the user’s project description.
          </p>

          <p>
            Instead of relying on keyword-based searches, this agent understands
            the <em>intent</em>, <em>domain</em>, and <em>objectives</em> of a
            project and compares them against grant requirements, eligibility,
            and funding scope.
          </p>
        </>
      ),
    },

    // -------------------- PROBLEM --------------------
    {
      id: "problem",
      title: "Problem This Agent Solves",
      content: (
        <ul className="list-disc pl-6 space-y-2">
          <li>Manual grant discovery is time-consuming and inefficient</li>
          <li>Keyword-based searches return irrelevant results</li>
          <li>Eligibility mismatches waste proposal-writing effort</li>
          <li>Users lack clarity on which grants are worth pursuing</li>
        </ul>
      ),
    },

    // -------------------- SOLUTION --------------------
    {
      id: "solution",
      title: "Solution Approach",
      content: (
        <>
          <p>
            This agent introduces an AI-driven search and ranking pipeline that
            evaluates grants based on <strong>semantic similarity</strong>,
            eligibility alignment, and project relevance.
          </p>

          <p>
            Each grant is assigned a transparent match score, allowing users to
            focus on the highest-probability funding opportunities.
          </p>
        </>
      ),
    },

    // -------------------- USER INPUT --------------------
    {
      id: "user-input",
      title: "User Inputs",
      content: (
        <ul className="list-disc pl-6 space-y-2">
          <li>Project description</li>
          <li>Organization type (nonprofit, academic, startup, etc.)</li>
          <li>Domain or focus area (health, education, research, social impact)</li>
          <li>Optional keywords or constraints</li>
        </ul>
      ),
    },

    // -------------------- DATA SOURCE --------------------
    {
      id: "data-source",
      title: "Grant Data Source",
      content: (
        <>
          <p>
            The agent fetches active and open funding opportunities from
            <strong> grants.gov</strong>.
          </p>

          <p>
            Retrieved grant data includes:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Grant title and summary</li>
            <li>Eligibility criteria</li>
            <li>Funding amount and limits</li>
            <li>Deadlines and agency information</li>
          </ul>
        </>
      ),
    },

    // -------------------- WORKFLOW --------------------
    {
      id: "workflow",
      title: "End-to-End Workflow",
      content: (
        <ol className="list-decimal pl-6 space-y-3">
          <li>User submits project and organization details</li>
          <li>Backend fetches active grants from grants.gov</li>
          <li>Grant data is normalized and cleaned</li>
          <li>Semantic embeddings are generated</li>
          <li>Each grant is compared against the project</li>
          <li>Grants are scored and ranked</li>
          <li>Results are returned to the user</li>
        </ol>
      ),
    },

    // -------------------- SEMANTIC MATCHING --------------------
    {
      id: "semantic-matching",
      title: "Semantic Matching",
      content: (
        <>
          <p>
            The agent uses AI embeddings to compare the meaning of the user’s
            project description with each grant’s objectives and scope.
          </p>

          <p>
            This enables matching based on intent rather than exact wording,
            significantly improving relevance over traditional keyword searches.
          </p>
        </>
      ),
    },

    // -------------------- SCORING --------------------
    {
      id: "scoring",
      title: "Scoring & Ranking Logic",
      content: (
        <>
          <p>
            Each grant is assigned a match score (e.g., 0–100) based on multiple
            weighted factors:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Semantic similarity</li>
            <li>Eligibility compatibility</li>
            <li>Domain and mission alignment</li>
            <li>Funding scope relevance</li>
          </ul>

          <p>
            Grants are then sorted from highest to lowest relevance.
          </p>
        </>
      ),
    },

    // -------------------- RESULTS --------------------
    {
      id: "results",
      title: "Results & Output",
      content: (
        <ul className="list-disc pl-6 space-y-2">
          <li>Ranked list of grants</li>
          <li>Relevance score for each grant</li>
          <li>Key matching insights</li>
          <li>Direct action to generate a proposal</li>
        </ul>
      ),
    },

    // -------------------- INTEGRATION --------------------
    {
      id: "integration",
      title: "Integration with Grant Generation Agent",
      content: (
        <>
          <p>
            Selected grants can be passed directly into the Grant Generation
            Agent, reusing the same project context and grant metadata.
          </p>

          <p>
            This creates a seamless flow from discovery to proposal creation.
          </p>
        </>
      ),
    },

    // -------------------- BEST PRACTICES --------------------
    {
      id: "best-practices",
      title: "Best Practices",
      content: (
        <ul className="list-disc pl-6 space-y-2">
          <li>Provide detailed and specific project descriptions</li>
          <li>Review top-ranked grants before proceeding</li>
          <li>Validate eligibility requirements manually</li>
          <li>Use match scores as guidance, not guarantees</li>
        </ul>
      ),
    },

    // -------------------- LIMITATIONS --------------------
    {
      id: "limitations",
      title: "Limitations",
      content: (
        <ul className="list-disc pl-6 space-y-2">
          <li>Some grants may have incomplete metadata</li>
          <li>Eligibility rules may require manual verification</li>
          <li>Relevance scoring does not guarantee funding success</li>
        </ul>
      ),
    },

    // -------------------- SECURITY --------------------
    {
      id: "security",
      title: "Security & Reliability",
      content: (
        <p>
          All data processing occurs on the backend with proper validation,
          rate-limiting, and error handling to ensure reliable and secure
          operations.
        </p>
      ),
    },

    // -------------------- NEXT STEPS --------------------
    {
      id: "next-steps",
      title: "Next Steps",
      content: (
        <p>
          Once a grant is selected, proceed to the Grant Generation Agent to
          generate a complete, funder-ready proposal using AI-assisted workflows.
        </p>
      ),
    },
  ],
}
