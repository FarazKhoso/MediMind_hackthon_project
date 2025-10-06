
'use client';

import { useState } from 'react';
import { mentalHealthChatbot, MentalHealthChatbotInput, MentalHealthChatbotOutput } from '@/ai/flows/mental-health-chatbot';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, SendHorizonal, Bot, User, BrainCircuit } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';


interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    escalate?: boolean;
}

function AssistantAvatar() {
  return (
    <Avatar className="w-10 h-10 border-2 border-primary shadow-sm">
      <AvatarFallback className="bg-primary text-primary-foreground">
        <Bot className="w-5 h-5" />
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


export default function MentalHealthPage() {
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  }

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setInput("");

    try {
      const response = await mentalHealthChatbot({ message: input });
      const assistantMessage: ChatMessage = { role: 'assistant', content: response.response, escalate: response.escalate };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error calling mental health chatbot:", error);
      const errorMessage: ChatMessage = { role: 'assistant', content: "Sorry, I couldn't process your request right now. Please try again." };
      setMessages(prev => [...prev, errorMessage]);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between p-4 border-b bg-card shadow-sm z-10">
        <h1 className="text-xl font-headline font-bold">Mental Health Support</h1>
        <SidebarTrigger />
      </header>
      <main className="flex-1 overflow-y-auto p-4">
        <div className="max-w-2xl mx-auto space-y-6">
            {messages.length === 0 && (
                <div className="text-center p-8 text-muted-foreground">
                    <MessageSquareHeart className="mx-auto h-12 w-12 mb-4" />
                    <h2 className="text-xl font-headline mb-2">You are not alone.</h2>
                    <p>Main yahan aapki madad ke liye hoon. Aap mujhse stress, anxiety, ya kisi bhi pareshani ke bare mein baat kar sakte hain.</p>
                </div>
            )}
            {messages.map((message, index) => (
                <div key={index} className={cn("flex items-start gap-4", message.role === 'user' ? 'justify-end' : 'justify-start')}>
                    {message.role === 'assistant' && <AssistantAvatar />}
                    <div className={cn("rounded-xl p-3 max-w-lg shadow", message.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-card rounded-bl-none')}>
                        <p className="whitespace-pre-wrap">{message.content}</p>
                         {message.escalate && (
                             <Card className="mt-4 bg-accent/50 border-primary">
                                <CardHeader className="pb-4">
                                    <CardTitle className="font-headline flex items-center gap-2 text-base">
                                        <BrainCircuit className="text-primary"/> Professional Help Recommended
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="mb-4 text-sm text-foreground/80">Aisa lagta hai ke aap shadeed pareshani mein hain. Kisi professional se baat karna behtar ho sakta hai.</p>
                                    <Button size="sm">Contact a Professional</Button>
                                </CardContent>
                            </Card>
                         )}
                    </div>
                    {message.role === 'user' && <UserAvatar />}
                </div>
            ))}
             {loading && (
                <div className="flex items-start gap-4">
                    <AssistantAvatar />
                    <div className="bg-card rounded-xl rounded-bl-none p-3 max-w-lg shadow">
                        <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                </div>
            )}
        </div>
      </main>
      <div className="p-4 bg-card/80 border-t backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="flex items-center gap-3 max-w-2xl mx-auto">
          <Textarea
            value={input}
            onChange={handleInputChange}
            placeholder="Aap kaisa mehsoos kar rahe hain?"
            className="flex-1 resize-none shadow-sm"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            disabled={loading}
          />
          <Button type="submit" size="icon" disabled={loading || !input.trim()}>
            <SendHorizonal />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
