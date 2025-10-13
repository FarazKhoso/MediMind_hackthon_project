
'use client';

import { useSearchParams } from "next/navigation";
import { ChatContainer } from "@/components/chat-container";
import { AppHeader } from "./header";

// This new client component safely uses the useSearchParams hook.
export function SymptomCheckerClient() {
  const searchParams = useSearchParams();
  // The initial agent can be read from the URL, but the chat container will manage it.
  const initialAgent = searchParams.get('agent') || 'General Physician';

  return (
    <div className="flex flex-col h-full">
       <header className="flex items-center justify-between p-4 border-b bg-card shadow-sm z-10">
        <h1 className="text-xl font-headline font-bold">
          AI Symptom Checker
        </h1>
        <AppHeader />
       </header>
      <main className="flex-1 overflow-hidden">
        <ChatContainer />
      </main>
    </div>
  );
}
