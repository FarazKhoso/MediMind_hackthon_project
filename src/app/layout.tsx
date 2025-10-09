import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase';
import { AppModeProvider } from '@/hooks/use-app-mode';
import { Open_Sans, Poppins } from 'next/font/google';
import { cn } from '@/lib/utils';
import { SidebarProvider } from '@/components/ui/sidebar';

const fontPoppins = Poppins({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-headline',
});

const fontOpenSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: 'MediConnect',
  description: 'Book Doctor Appointments Online, Anytime.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased',
          fontPoppins.variable,
          fontOpenSans.variable
        )}
      >
        <FirebaseClientProvider>
          <AppModeProvider>
            <SidebarProvider>{children}</SidebarProvider>
          </AppModeProvider>
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
