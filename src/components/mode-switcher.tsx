
'use client';

import { useAppMode, AppMode } from '@/hooks/use-app-mode';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { User, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/firebase';

export function ModeSwitcher() {
  const { mode, setMode, isProvider } = useAppMode();
  const { user } = useUser();

  if (!user || user.isAnonymous) {
    return null; // Don't show switcher if not logged in
  }

  return (
    <div className="p-2">
      <Select value={mode} onValueChange={(value) => setMode(value as AppMode)}>
        <SelectTrigger className={cn("w-full", !isProvider && "cursor-not-allowed opacity-50")}>
          <SelectValue placeholder="Select Mode" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="patient">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Patient Mode</span>
            </div>
          </SelectItem>
          <SelectItem value="provider" disabled={!isProvider}>
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span>Provider Mode</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
