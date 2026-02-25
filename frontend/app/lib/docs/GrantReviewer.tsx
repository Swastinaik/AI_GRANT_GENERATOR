import { FileCheck, Target, BarChart3, Lightbulb } from "lucide-react";

export const GrantReviewerAgent = {
    slug: "grant-reviewer",
    name: "Grant Reviewer Agent",
    description:
        "AI-powered grant application review with intelligent scoring and actionable improvement recommendations.",
    icon: <FileCheck className="h-5 w-5" />,
    sections: [
        {
            id: "overview",
            title: "Overview",
            content: (
                <p>
                    The Grant Reviewer Agent analyzes grant applications against funding
                    criteria to provide objective evaluation scores and strategic
                    recommendations. It helps organizations understand their application's
                    strengths and weaknesses before submission.
                </p>
            ),
        },
        {
            id: "workflow",
            title: "How It Works",
            content: (
                <ol className="list-decimal pl-6 space-y-2">
                    <li>Upload your grant application document</li>
                    <li>Provide the grant description or funding criteria</li>
                    <li>AI analyzes alignment between application and requirements</li>
                    <li>Receive a comprehensive selection score (0-100)</li>
                    <li>Get detailed improvement suggestions for each section</li>
                </ol>
            ),
        },
        {
            id: "scoring",
            title: "Intelligent Scoring System",
            content: (
                <ul className="list-disc pl-6 space-y-2">
                    <li>Multi-criteria evaluation based on grant requirements</li>
                    <li>Assessment of proposal clarity, impact, and feasibility</li>
                    <li>Budget alignment and justification analysis</li>
                    <li>Organizational capacity and track record evaluation</li>
                    <li>Overall funding likelihood score with confidence metrics</li>
                </ul>
            ),
        },
        {
            id: "recommendations",
            title: "Actionable Recommendations",
            content: (
                <p>
                    Beyond scoring, the AI provides specific, actionable suggestions to
                    strengthen your application. Recommendations cover content gaps,
                    narrative improvements, budget adjustments, and strategic positioning
                    to maximize your chances of securing funding.
                </p>
            ),
        },
        {
            id: "analysis",
            title: "Detailed Analysis Report",
            content: (
                <p>
                    The review generates a comprehensive report highlighting strengths,
                    weaknesses, and improvement opportunities. Each recommendation is
                    prioritized by impact, helping you focus on changes that will make
                    the biggest difference in your application's competitiveness.
                </p>
            ),
        },
    ],
}
