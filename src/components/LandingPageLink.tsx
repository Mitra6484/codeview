"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

interface LandingPageLinkProps {
  variant?: "text" | "button";
  className?: string;
}

export default function LandingPageLink({ variant = "text", className = "" }: LandingPageLinkProps) {
  if (variant === "button") {
    return (
      <Link href="/">
        <Button variant="outline" size="sm" className={`gap-2 ${className}`}>
          <Info className="h-4 w-4" />
          About CodeView
        </Button>
      </Link>
    );
  }

  return (
    <Link
      href="/"
      className={`text-sm text-muted-foreground hover:text-foreground transition-colors ${className}`}
    >
      About CodeView
    </Link>
  );
}
