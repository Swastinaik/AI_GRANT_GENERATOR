import { 
  SearchCheck,
  Target,
  Gauge,
  FileSpreadsheet,
} from "lucide-react";

export const benefits = [
  {
    title: "Smart Grant Discovery",
    description: "Our AI scans thousands of active grants from Grants.gov and instantly filters the ones aligned with your organization’s goals, domain, and project type.",
    icon: <SearchCheck className="w-6 h-6" />,
  },
  {
    title: "AI-Powered Relevance Scoring",
    description: "Using your project description and organizational details, our ranking engine scores each grant based on eligibility, alignment, budget fit, and success probability.",
    icon: <Target className="w-6 h-6" />,
  },
  {
    title: "Transparent Matching Metrics",
    description: "See exactly why a grant is recommended. Our dashboard breaks down match factors like keywords, past achievements relevance, funding range, and application difficulty.",
    icon: <Gauge className="w-6 h-6" />,
  },
  {
    title: "Direct Grant-to-Proposal Flow",
    description: "Once you pick a grant, seamlessly move into our proposal generator with auto-filled context. No duplicate writing — generate your tailored grant in minutes.",
    icon: <FileSpreadsheet className="w-6 h-6" />,
  },
];

export const testimonials = [
  {
    name: "Michael Turner",
    role: "Operations Lead, FutureSkills Initiative",
    content: "The ranking accuracy blew me away. We found 18 grants that fit our education project, and the top 3 were perfect matches we would have never discovered ourselves.",
    rating: 5
  },
  {
    name: "Lila Patel",
    role: "Program Manager, HealthBridge NGO",
    content: "The scoring breakdown helped us understand exactly why a grant was recommended. The eligibility clarity saved us hours of reading government PDFs.",
    rating: 5
  },
  {
    name: "Carlos Ramirez",
    role: "Founder, YouthForward",
    content: "We selected a grant and generated a proposal in one workflow. The integration between search and generation is incredibly smooth.",
    rating: 5
  }
];

export const faqs = [
  {
    question: "Where does the grant data come from?",
    answer: "We fetch real-time opportunity listings directly from Grants.gov using their public API, ensuring the results are always up to date."
  },
  {
    question: "How does the matching score work?",
    answer: "Our AI compares your description with each grant’s eligibility, focus areas, keywords, budget ranges, and required outcomes. Each grant gets a score from 0–100 based on relevance."
  },
  {
    question: "Can I refine the search results?",
    answer: "Yes! Filter by agency, funding amount, deadline, project type, eligibility, and more. The ranking updates instantly as you adjust filters."
  },
  {
    question: "Is there an option to generate a proposal for the selected grant?",
    answer: "Absolutely. Once you choose a grant, our AI pre-loads its requirements and helps you generate a fully aligned proposal with minimal editing."
  },
  {
    question: "Do you store my grant searches or descriptions?",
    answer: "No. Your project descriptions and search queries are processed securely and are not used for model training."
  }
];
