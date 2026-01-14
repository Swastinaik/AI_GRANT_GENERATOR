import {
  Mic,
  FileText,
  PlayCircle,
  Download,
} from "lucide-react";

export const benefits = [
  {
    title: "Human-Like Podcast Voices",
    description:
      "Generate vibrant, natural-sounding podcasts that feel like real human conversations — perfect for storytelling, education, and discussions.",
    icon: <Mic className="w-6 h-6" />,
  },
  {
    title: "AI-Written Podcast Scripts",
    description:
      "Just enter a topic or prompt. The AI creates a structured transcript with an engaging intro, smooth flow, real-world examples, and a strong conclusion.",
    icon: <FileText className="w-6 h-6" />,
  },
  {
    title: "Instant Streaming Experience",
    description:
      "Listen while it’s being generated. Podcasts are streamed in real time so users can start listening without waiting for the full audio.",
    icon: <PlayCircle className="w-6 h-6" />,
  },
];

export const testimonials = [
  {
    name: "Arjun Mehta",
    role: "Startup Founder",
    content:
      "I turned blog ideas into podcasts in minutes. The voice sounds natural and engaging — no mic, no editing, just publish.",
    rating: 5,
  },
  {
    name: "Sophia Williams",
    role: "Educator & Trainer",
    content:
      "The transcript quality is excellent, and the audio feels like a real host explaining concepts clearly. Perfect for e-learning.",
    rating: 5,
  },
  {
    name: "Rahul Verma",
    role: "Marketing Lead",
    content:
      "Streaming while generating is a game-changer. We now create branded podcasts weekly without any recording setup.",
    rating: 5,
  },
];

export const faqs = [
  {
    question: "How does the podcast generation work?",
    answer:
      "The AI first generates a detailed transcript from your topic or prompt. Once approved, the transcript is converted into high-quality audio using human-like voice synthesis."
  },
  {
    question: "Can I edit the transcript before generating audio?",
    answer:
      "Yes. You can fully edit the transcript — change tone, add sections, or refine wording — before converting it into audio."
  },
  {
    question: "Is real-time streaming supported?",
    answer:
      "Yes. Audio is streamed progressively so users can start listening while the podcast is still being generated."
  },
  {
    question: "What formats are supported?",
    answer:
      "Podcasts can be streamed in-app and downloaded as MP3 files, compatible with all major podcast platforms."
  },
  {
    question: "Is my content safe and private?",
    answer:
      "Absolutely. Your prompts, transcripts, and audio files are processed securely and are never used to train public AI models."
  },
];
