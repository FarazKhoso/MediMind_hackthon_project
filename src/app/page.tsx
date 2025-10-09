'use client';

import { AppDownloadCTA } from '@/components/landing/app-download-cta';
import { DoctorProfilesPreview } from '@/components/landing/doctor-profiles-preview';
import { FeaturedSpecialties } from '@/components/landing/featured-specialties';
import { Footer } from '@/components/landing/footer';
import { Header } from '@/components/landing/header';
import { HeroSection } from '@/components/landing/hero-section';
import { HowItWorks } from '@/components/landing/how-it-works';
import { Testimonials } from '@/components/landing/testimonials';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturedSpecialties />
        <HowItWorks />
        <DoctorProfilesPreview />
        <Testimonials />
        <AppDownloadCTA />
      </main>
      <Footer />
    </div>
  );
}
