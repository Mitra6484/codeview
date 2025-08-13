"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusIcon, EditIcon, TrashIcon } from "lucide-react";
import  AddQuestionDialog  from "@/components/questions/AddQuestionDialog";
import { useState } from "react";
import QuestionsList from "@/components/questions/QuestionsList";
import { useUserRole } from "@/hooks/useUserRole";
import { useRouter } from "next/navigation";
import LoaderUI from "@/components/LoaderUI";
import BreadcrumbNav from "@/components/BreadcrumbNav";

export default function QuestionsPage() {
  const router = useRouter();
  const { isInterviewer, isLoading } = useUserRole();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const questions = useQuery(api.questions.getQuestions);

  // Redirect if not an interviewer
  if (!isLoading && !isInterviewer) {
    router.push("/");
    return null;
  }

  if (isLoading) return <LoaderUI />;

  return (
    <div className="container mx-auto py-10">
      <BreadcrumbNav 
        items={[
          { label: "Admin Dashboard", href: "/admin-dashboard" },
          { label: "Manage Questions" }
        ]} 
        className="mb-4"
      />
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Manage Questions</h1>
        <Button onClick={() => setShowAddDialog(true)}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Question
        </Button>
      </div>

      <QuestionsList questions={questions || []} />

      <AddQuestionDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
      />
    </div>
  );
}
