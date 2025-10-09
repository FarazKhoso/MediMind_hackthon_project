
import { Suspense } from 'react';
import { SymptomCheckerClient } from '@/components/symptom-checker-client';
import { Loader2 } from 'lucide-react';

// This is now a server component that uses Suspense.
export default function SymptomCheckerPage() {
  return (
    <Suspense fallback={<div className="flex h-full w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
      <SymptomCheckerClient />
    </Suspense>
  );
}
