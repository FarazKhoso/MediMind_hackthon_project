import { ChatContainer } from "@/components/chat-container";
import { Logo } from "@/components/logo";

export default function Home() {
  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between p-4 border-b bg-card shadow-sm z-10">
        <Logo />
      </header>
      <main className="flex-1 overflow-hidden">
        <ChatContainer />
      </main>
    </div>
  );
}
