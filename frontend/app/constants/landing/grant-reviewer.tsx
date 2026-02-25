import {
    ShieldCheck,
    BarChart3,
    FileSearch,
    Zap,
} from "lucide-react";

export const benefits = [
    {
        title: "Instant Probability Scoring",
        description:
            "Stop guessing. Get an immediate algorithmic score out of 100 that predicts your funding success probability based on clarity, impact, and budget alignment.",
        icon: <BarChart3 className="w-6 h-6" />,
    },
    {
        title: "Deep-Dive Gap Analysis",
        description:
            "The AI doesn't just read; it scrutinizes. Receive detailed summaries highlighting missing compliance requirements, weak impact metrics, and narrative inconsistencies.",
        icon: <FileSearch className="w-6 h-6" />,
    },
    {
        title: "Compliance & Format Validation",
        description:
            "Ensure your proposal never gets rejected on technicalities. The agent automatically checks for formatting errors, word counts, and required keyword inclusion.",
        icon: <ShieldCheck className="w-6 h-6" />,
    },
];

export const testimonials = [
    {
        name: "Dr. Emily Chen",
        role: "Principal Investigator",
        content:
            "It flagged a critical compliance issue in my methodology section that I had completely missed. The scoring system gave me the confidence to hit submit.",
        rating: 5,
    },
    {
        name: "Marcus Johnson",
        role: "Non-Profit Director",
        content:
            "Writing grants is usually a black box. This agent gave us actionable feedback on our budget narrative, and we actually won the award this cycle.",
        rating: 5,
    },
    {
        name: "Sarah Jenkins",
        role: "Biotech Startup Founder",
        content:
            "I used the summaries to refine our pitch deck alongside the grant. Having an impartial AI review our proposal saved us weeks of consulting fees.",
        rating: 5,
    },
];

export const faqs = [
    {
        question: "How does the scoring system work?",
        answer:
            "The AI evaluates your uploaded document against thousands of successful grant proposals. It scores based on three key pillars: Clarity of Vision, Budget Feasibility, and Impact Metrics."
    },
    {
        question: "What file formats can I upload?",
        answer:
            "We currently support PDF and DOCX formats. The agent preserves your original formatting while extracting the text for analysis."
    },
    {
        question: "Does the AI rewrite my proposal?",
        answer:
            "The agent focuses on analysis and feedback. It provides detailed summaries and highlights areas for improvement, allowing you to retain your unique voice while optimizing the content."
    },
    {
        question: "Is my proprietary research safe?",
        answer:
            "Security is our top priority. Your proposals are processed in an encrypted environment and are immediately deleted from our processing servers after the session ends."
    },
    {
        question: "Can it analyze specific grant requirements?",
        answer:
            "Yes. You can paste the specific grant description or rubric alongside your file, and the AI will tailor its scoring and feedback to those specific constraints."
    },
];