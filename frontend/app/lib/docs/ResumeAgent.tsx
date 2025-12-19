import { FileUser } from "lucide-react";

export const ResumeAgent = {
  slug: "resume-agent",
  name: "Resume Optimization Agent",
  description:
    "Generate and optimize resumes using AI by matching candidate experience against job descriptions for high ATS compatibility.",
  icon: <FileUser className="h-5 w-5" />,
  sections: [

    // -------------------- OVERVIEW --------------------
    {
      id: "overview",
      title: "Overview",
      content: (
        <>
          <p>
            The Resume Optimization Agent helps users generate and refine
            professional resumes by intelligently aligning their experience,
            skills, and achievements with a specific job description.
          </p>

          <p>
            The agent is designed to maximize <strong>ATS (Applicant Tracking System)</strong>
            compatibility while preserving clarity, authenticity, and
            role-specific relevance.
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
          <li>Resumes get rejected by ATS before reaching recruiters</li>
          <li>Generic resumes fail to match job-specific requirements</li>
          <li>Keyword stuffing reduces readability and authenticity</li>
          <li>Candidates struggle to highlight relevant experience</li>
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
            This agent uses AI-driven resume analysis and job description
            matching to create resumes that are both
            <strong> ATS-friendly</strong> and <strong> recruiter-readable</strong>.
          </p>

          <p>
            Instead of blindly adding keywords, the agent intelligently
            restructures content to reflect job expectations and industry norms.
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
          <li>Existing resume (optional)</li>
          <li>Candidate details (experience, skills, education)</li>
          <li>Target job description</li>
          <li>Preferred role or career focus</li>
        </ul>
      ),
    },

    // -------------------- JOB DESCRIPTION ANALYSIS --------------------
    {
      id: "jd-analysis",
      title: "Job Description Analysis",
      content: (
        <>
          <p>
            The uploaded job description is analyzed to extract:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Required skills and technologies</li>
            <li>Role responsibilities</li>
            <li>Experience expectations</li>
            <li>Industry-specific terminology</li>
          </ul>

          <p>
            This forms the baseline for resume optimization.
          </p>
        </>
      ),
    },

    // -------------------- RESUME CONTEXT --------------------
    {
      id: "resume-context",
      title: "Candidate Context Extraction",
      content: (
        <>
          <p>
            If an existing resume is provided, the agent extracts structured
            information such as:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Work experience</li>
            <li>Technical and soft skills</li>
            <li>Projects and achievements</li>
            <li>Education and certifications</li>
          </ul>

          <p>
            This ensures the generated resume remains truthful and personalized.
          </p>
        </>
      ),
    },

    // -------------------- WORKFLOW --------------------
    {
      id: "workflow",
      title: "End-to-End Workflow",
      content: (
        <ol className="list-decimal pl-6 space-y-3">
          <li>User uploads resume or enters details</li>
          <li>User uploads target job description</li>
          <li>Agent analyzes job requirements</li>
          <li>Candidate data is structured and summarized</li>
          <li>Resume sections are optimized using AI</li>
          <li>ATS compatibility score is calculated</li>
          <li>Final resume is generated</li>
        </ol>
      ),
    },

    // -------------------- ATS OPTIMIZATION --------------------
    {
      id: "ats",
      title: "ATS Optimization Strategy",
      content: (
        <>
          <p>
            The Resume Optimization Agent focuses on ATS-friendly practices,
            including:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Keyword alignment with job descriptions</li>
            <li>Clear section headings</li>
            <li>Consistent formatting</li>
            <li>Role-specific terminology</li>
          </ul>

          <p>
            The goal is to pass automated screenings without sacrificing clarity.
          </p>
        </>
      ),
    },

    // -------------------- CONTENT GENERATION --------------------
    {
      id: "content-generation",
      title: "Resume Content Generation",
      content: (
        <>
          <p>
            Each resume section is generated or refined independently:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Professional summary</li>
            <li>Experience bullet points</li>
            <li>Skills section</li>
            <li>Project descriptions</li>
          </ul>

          <p>
            Content is tailored to the specific job role and industry.
          </p>
        </>
      ),
    },

    // -------------------- SCORING --------------------
    {
      id: "scoring",
      title: "Resume Match Scoring",
      content: (
        <>
          <p>
            The agent assigns a match score indicating how well the resume aligns
            with the job description.
          </p>

          <p>
            Scoring considers:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Skill overlap</li>
            <li>Experience relevance</li>
            <li>Keyword coverage</li>
            <li>Role alignment</li>
          </ul>
        </>
      ),
    },

    // -------------------- OUTPUT --------------------
    {
      id: "output",
      title: "Output & Results",
      content: (
        <ul className="list-disc pl-6 space-y-2">
          <li>Optimized resume</li>
          <li>ATS compatibility score</li>
          <li>Clear, recruiter-friendly formatting</li>
          <li>Editable content</li>
        </ul>
      ),
    },

    // -------------------- BEST PRACTICES --------------------
    {
      id: "best-practices",
      title: "Best Practices",
      content: (
        <ul className="list-disc pl-6 space-y-2">
          <li>Use accurate and truthful experience details</li>
          <li>Customize resumes for each job role</li>
          <li>Review generated content before submission</li>
          <li>Avoid overusing buzzwords</li>
        </ul>
      ),
    },

    // -------------------- LIMITATIONS --------------------
    {
      id: "limitations",
      title: "Limitations",
      content: (
        <ul className="list-disc pl-6 space-y-2">
          <li>ATS behavior varies across companies</li>
          <li>Final hiring decisions depend on recruiters</li>
          <li>Some roles require manual fine-tuning</li>
        </ul>
      ),
    },

    // -------------------- SECURITY --------------------
    {
      id: "security",
      title: "Security & Privacy",
      content: (
        <p>
          Uploaded resumes and job descriptions are processed securely and are
          not shared with third parties. Data is handled with strict validation
          and access controls.
        </p>
      ),
    },

    // -------------------- NEXT STEPS --------------------
    {
      id: "next-steps",
      title: "Next Steps",
      content: (
        <p>
          After generating the optimized resume, users can download it or use
          it as input for further career tools and application workflows.
        </p>
      ),
    },
  ],
}
