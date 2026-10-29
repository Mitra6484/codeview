"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect, useState, useCallback } from "react";

export type UserRole = "candidate" | "interviewer";

export const useUserRole = () => {
  const { user, isLoaded } = useUser();

  const userData = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );
  const syncUser = useMutation(api.users.syncUser);
  const updateUserRole = useMutation(api.users.updateUserRole);

  const [testRole, setTestRole] = useState<UserRole | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Sync role changes and initialize from localStorage after hydration
  useEffect(() => {
    setIsMounted(true);
    const saved =
      (localStorage.getItem("codeview_test_role") as UserRole | null) ||
      (localStorage.getItem("codeview_signup_role") as UserRole | null);
    if (saved === "interviewer" || saved === "candidate") {
      setTestRole(saved);
    }

    const handleRoleChanged = () => {
      const updated = localStorage.getItem("codeview_test_role") as UserRole | null;
      if (updated === "interviewer" || updated === "candidate") {
        setTestRole(updated);
      }
    };

    window.addEventListener("codeview_role_changed", handleRoleChanged);
    return () => window.removeEventListener("codeview_role_changed", handleRoleChanged);
  }, []);

  // Auto-sync user to Convex on login
  useEffect(() => {
    if (isLoaded && user && userData === null) {
      const signupRole = (typeof window !== "undefined" ? localStorage.getItem("codeview_signup_role") : null) as UserRole | null;
      syncUser({
        name: user.fullName || user.firstName || "Engineer",
        email: user.primaryEmailAddress?.emailAddress || "",
        clerkId: user.id,
        image: user.imageUrl,
      }).then(() => {
        if (signupRole === "interviewer") {
          updateUserRole({ role: "interviewer" }).catch(() => {});
        }
      }).catch((e) => console.log("User sync notice:", e));
    }
  }, [isLoaded, user, userData, syncUser, updateUserRole]);

  const switchRole = useCallback((newRole: UserRole) => {
    setTestRole(newRole);
    if (typeof window !== "undefined") {
      localStorage.setItem("codeview_test_role", newRole);
      localStorage.removeItem("codeview_signup_role");
      window.dispatchEvent(new Event("codeview_role_changed"));
    }
    if (user?.id) {
      updateUserRole({ role: newRole }).catch(() => {});
    }
  }, [user?.id, updateUserRole]);

  const activeRole: UserRole =
    testRole || (userData?.role as UserRole) || "candidate";

  const isLoading = isLoaded && !!user && userData === undefined && testRole === null;

  return {
    isLoading,
    isMounted,
    role: activeRole,
    isInterviewer: isMounted ? activeRole === "interviewer" : false,
    isCandidate: isMounted ? activeRole === "candidate" : true,
    switchRole,
  };
};