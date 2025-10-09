
'use client';

import { ChatContainer } from "@/components/chat-container";
import { useSearchParams } from "next/navigation";

// Force dynamic rendering to ensure useSearchParams works correctly.
export const dynamic = 'force-dynamic';

export default function SymptomCheckerPage() {
  const searchParams = useSearchParams();
  const agent = searchParams.get('agent') || undefined;

  return (
    <div className="flex flex-col h-full">
       <header className="flex items-center justify-between p-4 border-b bg-card shadow-sm z-10">
        <h1 className="text-xl font-headline font-bold">
          {agent ? `${agent} AI Agent` : 'AI Symptom Checker'}
        </h1>
       </header>
      <main className="flex-1 overflow-hidden">
        <ChatContainer agent={agent} />
      </main>
    </div>
  );
}
