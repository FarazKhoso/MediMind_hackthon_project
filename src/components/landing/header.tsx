'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Logo } from './logo';

const navLinks = [
  { href: '#', label: 'Find a Doctor' },
  { href: '#', label: 'Labs' },
  { href: '#', label: 'For Doctors' },
  { href: '#', label: 'Contact' },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm">
      <div className="container flex h-20 items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-semibold text-foreground/80 transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost">Sign In</Button>
          <Button>Book Appointment</Button>
        </div>
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="container absolute grid w-full grid-cols-1 gap-4 bg-background pb-8 shadow-lg md:hidden">
          <nav className="grid gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-lg font-semibold"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2 border-t pt-4">
            <Button variant="outline">Sign In</Button>
            <Button>Book Appointment</Button>
          </div>
        </div>
      )}
    </header>
  );
}
