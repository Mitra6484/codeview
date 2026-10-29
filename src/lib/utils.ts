import { clsx, type ClassValue } from "clsx";
import { addHours, intervalToDuration, isAfter, isBefore, isWithinInterval } from "date-fns";
import { twMerge } from "tailwind-merge";
import { Doc } from "../../convex/_generated/dataModel";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Interview = Doc<"interviews">;
type User = Doc<"users">;

export const groupInterviews = (interviews: Interview[]): Record<string, Interview[]> => {
  if (!interviews) return {};

  const now = new Date();

  return interviews.reduce((acc: any, interview: Interview) => {
    const date = new Date(interview.startTime);
    const interviewStartTime = date.getTime();
    const endTime = addHours(date, 1);

    // For scheduled interviews, determine status based on time
    if (interview.status === "scheduled") {
      if (isBefore(now, interviewStartTime)) {
        acc.upcoming = [...(acc.upcoming || []), interview];
      } else if (isWithinInterval(now, { start: date, end: endTime })) {
        acc.live = [...(acc.live || []), interview];
      } else {
        acc.completed = [...(acc.completed || []), interview];
      }
    } else {
      // For other statuses, use them directly
      acc[interview.status] = [...(acc[interview.status] || []), interview];
    }

    return acc;
  }, {});
};

export const getCandidateInfo = (users?: User[] | null, candidateId?: string) => {
  const candidate = candidateId && Array.isArray(users) ? users.find((user) => user.clerkId === candidateId) : null;
  const name = candidate?.name || "Unknown Candidate";
  return {
    name,
    image: candidate?.image || "",
    initials:
      name
        .split(" ")
        .map((n) => n[0])
        .filter(Boolean)
        .join("")
        .slice(0, 2)
        .toUpperCase() || "UC",
  };
};

export const getInterviewerInfo = (users?: User[] | null, interviewerId?: string) => {
  const interviewer = interviewerId && Array.isArray(users) ? users.find((user) => user.clerkId === interviewerId) : null;
  const name = interviewer?.name || "Unknown Interviewer";
  return {
    name,
    image: interviewer?.image,
    initials:
      name
        .split(" ")
        .map((n) => n[0])
        .filter(Boolean)
        .join("")
        .slice(0, 2)
        .toUpperCase() || "UI",
  };
};

export const calculateRecordingDuration = (startTime: string, endTime: string) => {
  const start = new Date(startTime);
  const end = new Date(endTime);

  const duration = intervalToDuration({ start, end });

  if (duration.hours && duration.hours > 0) {
    return `${duration.hours}:${String(duration.minutes).padStart(2, "0")}:${String(
      duration.seconds
    ).padStart(2, "0")}`;
  }

  if (duration.minutes && duration.minutes > 0) {
    return `${duration.minutes}:${String(duration.seconds).padStart(2, "0")}`;
  }

  return `${duration.seconds} seconds`;
};

export const getMeetingStatus = (interview: Interview) => {
  const now = new Date();
  const interviewStartTime = new Date(interview.startTime);
  const endTime = addHours(interviewStartTime, 1);

  // First check the interview's explicit status
  if (interview.status === "succeeded" || interview.status === "failed") {
    return interview.status;
  }

  // For scheduled interviews, determine status based on time
  if (interview.status === "scheduled") {
    if (isBefore(now, interviewStartTime)) {
      return "scheduled";
    }
    if (isWithinInterval(now, { start: interviewStartTime, end: endTime })) {
      return "live";
    }
    if (isAfter(now, endTime)) {
      return "completed";
    }
  }

  // For live interviews
  if (interview.status === "live") {
    if (isWithinInterval(now, { start: interviewStartTime, end: endTime })) {
      return "live";
    }
    return "completed";
  }

  return interview.status;
};