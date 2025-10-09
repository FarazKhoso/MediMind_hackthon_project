
'use client';

import { ChatContainer } from "@/components/chat-container";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function SymptomCheckerPage() {
  return (
    <div className="flex flex-col h-full">
       <header className="flex items-center justify-between p-4 border-b bg-card shadow-sm z-10 md:hidden">
        <h1 className="text-xl font-headline font-bold">AI Symptom Checker</h1>
        <SidebarTrigger />
      </header>
      <main className="flex-1 overflow-hidden">
        <ChatContainer />
      </main>
    </div>
  );
}
