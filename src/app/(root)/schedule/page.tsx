"use client";

import LoaderUI from "@/components/LoaderUI";
import { useUserRole } from "@/hooks/useUserRole";
import InterviewScheduleUI from "./InterviewScheduleUI";

function SchedulePage() {
  const { isMounted, isLoading } = useUserRole();

  if (!isMounted || isLoading) return <LoaderUI />;

  return <InterviewScheduleUI />;
}

export default SchedulePage;
