import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase';
import { AppModeProvider } from '@/hooks/use-app-mode';
import { MainLayout } from '@/components/main-layout';
import { SidebarProvider } from '@/components/ui/sidebar';

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
      <body className="font-body antialiased h-full bg-background">
        <FirebaseClientProvider>
          <AppModeProvider>
            <SidebarProvider>
              <MainLayout>
                {children}
              </MainLayout>
            </SidebarProvider>
          </AppModeProvider>
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
