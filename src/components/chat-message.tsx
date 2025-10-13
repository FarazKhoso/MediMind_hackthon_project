
'use client'

import type { AIHealthQueryOutput } from '@/ai/flows/ai-health-query';
import type { ChatMessage } from '@/lib/types';
import { cn } from '@/lib/utils';
import { AlertTriangle, Bot, BrainCircuit, HeartPulse, Lightbulb, User, ArrowRight, Stethoscope, Info } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from './ui/button';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { requestDoctorHandoff } from '@/app/actions';
import { Skeleton } from './ui/skeleton';

function AssistantAvatar() {
  return (
    <Avatar className="w-10 h-10 border-2 border-primary shadow-sm">
      <AvatarFallback className="bg-primary text-primary-foreground">
        <Stethoscope className="w-5 h-5" />
      </AvatarFallback>
    </Avatar>
  );
}

function UserAvatar() {
  return (
    <Avatar className="w-10 h-10 shadow-sm">
      <AvatarFallback>
        <User />
      </AvatarFallback>
    </Avatar>
  );
}

function LoadingMessage() {
  return (
    <div className="flex items-start gap-4">
      <AssistantAvatar />
      <div className="flex flex-col gap-3 pt-1 w-full max-w-md">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-12 w-4/5" />
      </div>
    </div>
  );
}

function AICard({ title, icon: Icon, children }: { title: string; icon: React.ElementType, children: React.ReactNode }) {
  return (
    <Card className="bg-background/50 shadow-sm">
      <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
        <Icon className="w-5 h-5 text-primary" />
        <CardTitle className="text-lg font-headline">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-foreground/80 pt-2">
        {children}
      </CardContent>
    </Card>
  )
}

function AIMessage({ content, userQuery }: { content: AIHealthQueryOutput, userQuery: string }) {
  const [handoffLoading, setHandoffLoading] = useState(false);
  const { toast } = useToast();

  const handleHandoff = async () => {
    setHandoffLoading(true);
    const diagnosisSummary = `Insights: ${content.insights}. Risks: ${content.riskFactors}.`;
    const result = await requestDoctorHandoff(userQuery, diagnosisSummary, content.confidenceScore);
    
    toast({
      title: result.handoffInitiated ? "Handoff Requested" : "Handoff Failed",
      description: result.message,
      variant: result.handoffInitiated ? "default" : "destructive",
    });
    setHandoffLoading(false);
  }

  const confidencePercent = (content.confidenceScore * 100).toFixed(0);

  // If the query is not medical, show a simple decline message.
  if (!content.isMedicalQuery) {
    return (
        <AICard title="Response" icon={Info}>
            <p>{content.declineMessage || "I can only answer health-related questions."}</p>
        </AICard>
    );
  }
  

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {content.insights && content.insights !== "N/A" && <AICard title="Insights" icon={Lightbulb}>{content.insights}</AICard>}
        {content.riskFactors && content.riskFactors !== "N/A" && <AICard title="Potential Risk Factors" icon={AlertTriangle}>{content.riskFactors}</AICard>}
        {content.nextSteps && content.nextSteps !== "N/A" && <AICard title="Possible Next Steps" icon={ArrowRight}>{content.nextSteps}</AICard>}
      </div>
      
      <Alert>
        <HeartPulse className="h-4 w-4" />
        <AlertTitle className="font-headline">Disclaimer</AlertTitle>
        <AlertDescription>
          This is an AI-generated response (Confidence: {confidencePercent}%) and not a substitute for professional medical advice. Please consult with a healthcare provider for any health concerns.
        </AlertDescription>
      </Alert>
      
      {content.handoffRequired && (
        <Card className="bg-accent/50 border-primary">
            <CardHeader className="pb-4">
                <CardTitle className="font-headline flex items-center gap-2">
                    <BrainCircuit className="text-primary"/> Further Consultation Recommended
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="mb-4 text-sm text-foreground/80">The AI suggests that a consultation with a medical professional is advisable for your query.</p>
                <Button onClick={handleHandoff} disabled={handoffLoading}>
                    {handoffLoading ? "Requesting..." : "Contact a Doctor"}
                </Button>
            </CardContent>
        </Card>
      )}
    </div>
  );
}

export function ChatMessageComponent({ message, userQuery }: { message: ChatMessage; userQuery: string; }) {
  if (message.role === 'user') {
    return (
      <div className="flex items-start gap-4 justify-end">
        <div className="bg-primary text-primary-foreground rounded-xl rounded-br-sm p-3 max-w-xl shadow">
          <p>{message.content as string}</p>
        </div>
        <UserAvatar />
      </div>
    );
  }
  
  if (message.role === 'assistant' && typeof message.content === 'object') {
     return (
       <div className="flex items-start gap-4 animate-in fade-in duration-500">
         <AssistantAvatar />
         <div className="bg-card rounded-xl rounded-bl-sm p-4 max-w-2xl w-full shadow">
            <AIMessage content={message.content} userQuery={userQuery} />
         </div>
       </div>
     );
  }

  return null;
}

export { LoadingMessage };
