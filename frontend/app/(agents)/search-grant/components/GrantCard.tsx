'use client';

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from 'next/navigation';
import { GrantType } from '../../../lib/utils/types';
import useAuthStore from "@/app/store/AuthStore";
import { Building2, Calendar, ExternalLink, Sparkles, Activity } from "lucide-react";

interface GrantCardProps {
  grant: GrantType;
}

export default function GrantCard({ grant }: GrantCardProps) {
  const setFundersDetail = useAuthStore((state) => state.setFundersDetail);
  const { id, title, agency, agencyCode, openDate, closeDate, link, score } = grant;

  const fundersDetail = `The id of Organization is ${id} title ${title}, agency name is ${agency} with code ${agencyCode}, the opening date for the grant is ${openDate} and closing date is ${closeDate}`;
  const router = useRouter();

  const handleGenerate = () => {
    try {
      setFundersDetail(fundersDetail);
      router.push(`/generate-grant`);
    } catch (error) {
      console.log(error);
    }
  };

  // Visual helper for score
  const getScoreVariant = (scoreValue: number) => {
    if (scoreValue >= 80) return "default"; // Usually primary color
    if (scoreValue >= 50) return "secondary";
    return "destructive";
  };

  return (
    <Card className="flex flex-col h-full bg-card border-border shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-300 group overflow-hidden">

      <CardHeader className="pb-4 border-b border-border/50 bg-muted/10">
        <div className="flex justify-between items-start gap-4 mb-2">
          <Badge variant="outline" className="bg-background font-medium text-xs">
            {agencyCode}
          </Badge>
          <Badge variant={getScoreVariant(Number(score))} className="flex items-center gap-1 shadow-none">
            <Activity className="w-3 h-3" />
            Match: {score}%
          </Badge>
        </div>
        <CardTitle className="text-xl font-bold leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 space-y-4 pt-5 text-sm">
        <div className="flex items-start gap-3">
          <Building2 className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
          <div>
            <p className="font-medium text-foreground leading-none mb-1">Agency</p>
            <p className="text-muted-foreground">{agency}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="flex items-start gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-foreground leading-none mb-1">Opens</p>
              <p className="text-muted-foreground">{openDate || 'N/A'}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-foreground leading-none mb-1">Closes</p>
              <p className="text-muted-foreground">{closeDate || 'N/A'}</p>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-4 pb-6 px-6 border-t border-border/50 gap-3 flex flex-col sm:flex-row bg-background/50">
        <Button
          variant="outline"
          className="w-full sm:flex-1 bg-background hover:bg-muted"
          asChild
        >
          <a href={link} target="_blank" rel="noopener noreferrer">
            View Details
            <ExternalLink className="w-4 h-4 ml-2 opacity-70" />
          </a>
        </Button>
        <Button
          onClick={handleGenerate}
          className="w-full sm:flex-1 shadow-sm"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Draft Grant
        </Button>
      </CardFooter>

    </Card>
  );
}