import {
  User,
  FileText,
  CheckCircle,
  Award,
  Zap,
} from "lucide-react";

export const benefits = [
  {
    title: "ATS-Optimized Resumes",
    description: "Automatically tailor resumes to beat Applicant Tracking Systems by optimizing keywords, section order, and formatting according to the uploaded job description.",
    icon: <CheckCircle className="w-6 h-6" />,
  },
  {
    title: "Smart Keyword Tailoring",
    description: "Our AI compares your existing resume or user-provided details with the job posting and surfaces the highest-impact keywords, skills, and action verbs to include.",
    icon: <Zap className="w-6 h-6" />,
  },
  {
    title: "Role-Focused Scoring & Feedback",
    description: "Each generated resume receives an ATS compatibility score and clear suggestions (strengths, gaps, and recommended phrases) so you know exactly what to improve.",
    icon: <Award className="w-6 h-6" />,
  },
];

export const testimonials = [
  {
    name: "Priya Nair",
    role: "Frontend Developer",
    content: "I uploaded my old CV and a job listing — the agent rewrote my experience with the right keywords and I moved to interview stage within a week.",
    rating: 5
  },
  {
    name: "Rohit Sharma",
    role: "Data Scientist",
    content: "The ATS score and the line-by-line suggestions made it obvious what was missing. The generated resume looked professional and got more recruiter responses.",
    rating: 5
  },
  {
    name: "Ananya Mehta",
    role: "Product Manager",
    content: "I loved the one-click job-tailoring flow. It saved hours and the formatting stayed clean across LinkedIn, PDF and Word exports.",
    rating: 5
  }
];

export const faqs = [
  {
    question: "How does the agent improve my ATS score?",
    answer: "The agent parses the job description and ranks keywords, required skills, and preferred experience. It then rephrases and prioritizes your resume content to match those signals while preserving truthfulness."
  },
  {
    question: "Can I upload multiple resumes or a LinkedIn profile?",
    answer: "Yes. Upload any prior resume(s) or paste your LinkedIn/profile details. The agent merges relevant experiences and deduplicates content to create a concise, role-focused resume."
  },
  {
    question: "Will the agent lie or fabricate experience?",
    answer: "No. We do not invent experience. Our edits focus on phrasing, relevance, and prioritization — we recommend the best way to present your real achievements and quantify them when possible."
  },
  {
    question: "What export formats are supported?",
    answer: "Download ready-to-send resumes in PDF and DOCX formats. We also provide copy-to-clipboard for LinkedIn-friendly summaries and bullet points."
  },
  {
    question: "Is my personal data and resume secure?",
    answer: "Absolutely. Uploaded resumes and job descriptions are processed in an isolated environment and are not used to train public models. You can also opt to delete your data after generation."
  }
];
