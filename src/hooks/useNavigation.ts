"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";

export const useNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();

  const goToDashboard = useCallback(() => {
    router.push("/dashboard");
  }, [router]);

  const goToLanding = useCallback(() => {
    router.push("/");
  }, [router]);

  const goToAdminDashboard = useCallback(() => {
    router.push("/admin-dashboard");
  }, [router]);

  const goToQuestions = useCallback(() => {
    router.push("/admin-dashboard/questions");
  }, [router]);

  const goToSchedule = useCallback(() => {
    router.push("/schedule");
  }, [router]);

  const goToRecordings = useCallback(() => {
    router.push("/recordings");
  }, [router]);

  const isOnLandingPage = pathname === "/" || pathname === "/landing";
  const isOnDashboard = pathname === "/dashboard";
  const isOnAdminDashboard = pathname === "/admin-dashboard";
  const isOnQuestions = pathname === "/admin-dashboard/questions";
  const isOnSchedule = pathname === "/schedule";
  const isOnRecordings = pathname === "/recordings";

  return {
    // Navigation functions
    goToDashboard,
    goToLanding,
    goToAdminDashboard,
    goToQuestions,
    goToSchedule,
    goToRecordings,
    
    // Current location checks
    isOnLandingPage,
    isOnDashboard,
    isOnAdminDashboard,
    isOnQuestions,
    isOnSchedule,
    isOnRecordings,
    
    // Current pathname
    currentPath: pathname,
  };
};
