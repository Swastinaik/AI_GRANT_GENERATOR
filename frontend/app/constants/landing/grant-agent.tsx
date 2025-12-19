
import { 
  FileText, 
  Zap, 
  LayoutTemplate, 
 
} from "lucide-react";

export const benefits = [
  {
    title: "Context-Aware Intelligence",
    description: "Our AI reads your organization's history, achievements, and success rates first. This reduces hallucinations and ensures every word aligns with your mission.",
    icon: <FileText className="w-6 h-6" />,
  },
  {
    title: "Parallel Section Generation",
    description: "Why wait? Our asynchronous backend generates the Executive Summary, Budget, and Cover Letter simultaneously, cutting drafting time by 80%.",
    icon: <Zap className="w-6 h-6" />,
  },
  {
    title: "Professional Templates",
    description: "Export directly to polished formats. Use our built-in editor to tweak the content, then download in standard grant templates ready for submission.",
    icon: <LayoutTemplate className="w-6 h-6" />,
  },
];

export const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "Director, GreenEarth Foundation",
    content: "The context awareness is a game changer. It actually remembered our 2023 water project metrics when writing the impact statement.",
    rating: 5
  },
  {
    name: "David Chen",
    role: "Grant Manager, EduCare",
    content: "I used to spend weeks on a proposal. With the parallel generation feature, I got a 90% draft done in 15 minutes.",
    rating: 5
  },
  {
    name: "Elena Rodriguez",
    role: "Founder, City Arts Initiative",
    content: "The templates are beautiful. I didn't have to worry about formatting, just downloaded and submitted.",
    rating: 5
  }
];

export const faqs = [
  {
    question: "Is my organization's data secure?",
    answer: "Absolutely. We do not use your private organization data to train our public models. Your uploaded files are processed in a secure, isolated environment."
  },
  {
    question: "How does the AI reduce hallucination?",
    answer: "Before generating any text, our backend summarizes your uploaded documents (achievements, history) to create a 'ground truth' context layer that the AI must adhere to."
  },
  {
    question: "Can I edit the grant after generation?",
    answer: "Yes! We provide a rich-text editor where you can refine the AI-generated sections before downloading the final PDF or Word document."
  },
  {
    question: "What templates are available?",
    answer: "We support standard federal grant formats, foundation letter templates, and general project proposal structures."
  }
];

