import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset } from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import { Bot, HeartPulse, Stethoscope, Syringe, MessageSquareHeart } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'MediMind AI',
  description: 'Your AI Health Assistant',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased h-full">
        <FirebaseClientProvider>
          <SidebarProvider>
            <Sidebar>
              <SidebarContent className="p-4">
                <SidebarHeader>
                  <Logo />
                </SidebarHeader>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <Link href="/">
                      <SidebarMenuButton tooltip="Symptom Checker">
                        <Bot />
                        <span>Symptom Checker</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <Link href="/disease-tracking">
                      <SidebarMenuButton tooltip="Disease Tracking">
                        <HeartPulse />
                        <span>Disease Tracking</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                   <SidebarMenuItem>
                    <Link href="/health-analysis">
                      <SidebarMenuButton tooltip="Health Analysis">
                        <Stethoscope />
                        <span>Health Analysis</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <Link href="/medicine-reminder">
                      <SidebarMenuButton tooltip="Reminders">
                        <Syringe />
                        <span>Reminders</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <Link href="/mental-health">
                      <SidebarMenuButton tooltip="Mental Health">
                        <MessageSquareHeart />
                        <span>Mental Health</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarContent>
            </Sidebar>
            <SidebarInset>
              {children}
            </SidebarInset>
          </SidebarProvider>
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
