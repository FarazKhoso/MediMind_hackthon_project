
'use client';

import { useSearchParams } from "next/navigation";
import { ChatContainer } from "@/components/chat-container";
import { useEffect, useState } from "react";
import { AppHeader } from "./header";

// This new client component safely uses the useSearchParams hook.
export function SymptomCheckerClient() {
  const searchParams = useSearchParams();
  const agentFromUrl = searchParams.get('agent') || 'General Physician';
  const [agent, setAgent] = useState(agentFromUrl);
  
  useEffect(() => {
    setAgent(agentFromUrl);
  }, [agentFromUrl]);


  return (
    <div className="flex flex-col h-full">
       <header className="flex items-center justify-between p-4 border-b bg-card shadow-sm z-10">
        <h1 className="text-xl font-headline font-bold">
          {agent === 'General Physician' ? 'AI Symptom Checker' : `${agent} AI Agent`}
        </h1>
        <AppHeader />
       </header>
      <main className="flex-1 overflow-hidden">
        <ChatContainer initialAgent={agent} />
      </main>
    </div>
  );
}
