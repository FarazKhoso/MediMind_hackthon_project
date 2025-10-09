'use client'

import { getAIResponse } from "@/app/actions";
import { useUser, useFirestore, useAuth } from "@/firebase";
import { logConsultation } from "@/services/consultation-history";
import type { ChatMessage } from "@/lib/types";
import { SendHorizonal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { EmptyChat } from "./empty-chat";
import { ChatMessageComponent, LoadingMessage } from "./chat-message";
import { signInAnonymously } from "firebase/auth";

interface ChatContainerProps {
  agent?: string;
}

export function ChatContainer({ agent }: ChatContainerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const auth = useAuth();

  // Sign in user anonymously on component mount
  useEffect(() => {
    if (!user && !isUserLoading && auth) {
      signInAnonymously(auth);
    }
  }, [user, isUserLoading, auth]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  }

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>, query?: string) => {
    e?.preventDefault();
    const userQuery = query || input;
    if (!userQuery.trim()) return;

    if (!user || !firestore) {
        console.error("User not authenticated or Firestore not available, cannot proceed.");
        // Optionally show a toast message to the user
        return;
    }

    setIsLoading(true);
    setInput("");

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userQuery,
    };
    setMessages(prev => [...prev, userMessage]);

    // Now getAIResponse is called with the userId and the agent specialty.
    const aiResponse = await getAIResponse(user.uid, userQuery, agent);

    // Only log consultations for non-anonymous users
    if (!user.isAnonymous) {
      logConsultation(firestore, {
        userId: user.uid,
        userQuery: userQuery,
        aiResponse: aiResponse.insights,
        confidenceScore: aiResponse.confidenceScore,
        handoffStatus: aiResponse.handoffRequired ? "pending" : "not_required",
      });
    }

    const aiMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: aiResponse,
    };
    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
  }
  
  const handleExampleQuery = (query: string) => {
    handleSubmit(undefined, query);
  }
  
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);


  return (
    <div className="flex flex-col h-full">
      <div className="relative flex-1">
        <div className="absolute inset-0 overflow-y-auto" ref={scrollRef}>
            <div className="p-4 md:p-8 space-y-6 max-w-4xl mx-auto">
            {messages.length === 0 && !isLoading ? (
                <EmptyChat onQuery={handleExampleQuery} />
            ) : (
                messages.map((message, index) => {
                const userQuery = message.role === 'assistant' && index > 0 && messages[index - 1].role === 'user' 
                    ? messages[index - 1].content as string 
                    : '';
                return <ChatMessageComponent key={message.id} message={message} userQuery={userQuery} />;
                })
            )}
            {isLoading && <LoadingMessage />}
            </div>
        </div>
      </div>
      <div className="p-4 bg-card/80 border-t backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="flex items-center gap-3 max-w-4xl mx-auto">
          <Textarea
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about symptoms, treatments, or health questions..."
            className="flex-1 resize-none shadow-sm"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            disabled={isLoading || isUserLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading || isUserLoading || !input.trim()}>
            <SendHorizonal />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
