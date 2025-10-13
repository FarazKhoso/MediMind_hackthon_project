
'use client';
// This page is now a redirector or can be removed,
// as the main registration flow is handled by /register/provider.
// For now, let's just redirect to the new provider registration page.

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OldRegisterPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/register/provider');
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <p>Redirecting...</p>
    </div>
  );
}
