import { GrantAgent } from "./GrantGeneration";
import { SearchGrant } from "./SeachGrant";
import { ResumeAgent } from "./ResumeAgent";
import { PodcastAgent } from "./PodcastAgent";
import { GrantReviewerAgent } from "./GrantReviewer";
export type DocsSection = {
  id: string;
  title: string;
  description?: string;
  content: React.ReactNode;
};

export type AgentDocs = {
  slug: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  sections: DocsSection[];
};

export const agentsDocs: AgentDocs[] = [
  GrantAgent,
  SearchGrant,
  ResumeAgent,
  PodcastAgent,
  GrantReviewerAgent,
];
