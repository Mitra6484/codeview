"use client";

import LandingNavbar from "./LandingNavbar";
import HeroSection from "./HeroSection";
import FeaturesGrid from "./FeaturesGrid";
import WorkflowSection from "./WorkflowSection";
import AuthSection from "./AuthSection";
import LandingFooter from "./LandingFooter";

export default function LandingPage() {
  return (
    <div className="min-h-screen glass-canvas flex flex-col justify-between selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Floating Glass Navigation */}
      <LandingNavbar />

      {/* Main Content Sections */}
      <main className="flex-1 flex flex-col">
        <HeroSection />
        <FeaturesGrid />
        <WorkflowSection />
        <AuthSection />
      </main>

      {/* Glassmorphic Footer */}
      <LandingFooter />
    </div>
  );
}
