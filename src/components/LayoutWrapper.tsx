"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import PageTransition from "./PageTransition";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";
  const isLandingRoute = pathname === "/landing";

  // Don't show navbar for the root landing page
  if (isLandingPage) {
    return <>{children}</>;
  }

  // Don't show navbar for the /landing route (if it still exists)
  if (isLandingRoute) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="px-4 sm:px-6 lg:px-8">
        <PageTransition>
          {children}
        </PageTransition>
      </main>
    </div>
  );
}
