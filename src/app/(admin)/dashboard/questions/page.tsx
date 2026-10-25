"use client"

import { useState } from "react"
import { useQuery } from "convex/react"
import { api } from "../../../../../convex/_generated/api"
import LoaderUI from "@/components/LoaderUI"
import { Button } from "@/components/ui/button"
import { PlusIcon, Sparkles } from "lucide-react"
import QuestionsList from "@/components/questions/QuestionsList"
import AddQuestionDialog from "@/components/questions/AddQuestionDialog"
import AiQuestionGeneratorModal from "@/components/questions/AiQuestionGeneratorModal"

export default function QuestionsPage() {
  const questions = useQuery(api.questions.getAllQuestions)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isAiGeneratorOpen, setIsAiGeneratorOpen] = useState(false)

  if (questions === undefined) return <LoaderUI />

  return (
    <div className="container mx-auto py-10 px-4 max-w-7xl">
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-surface text-xs font-mono text-indigo-400 mb-2 border border-indigo-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Assisted Question Bank</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Coding Challenges</h1>
          <p className="text-sm text-slate-400 mt-1">Manage, curate, or synthesize AI-generated coding challenges</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAiGeneratorOpen(true)}
            className="glass-btn-primary px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-500/25 transition-transform active:scale-95"
          >
            <Sparkles className="h-4 w-4 text-indigo-300" />
            <span>Generate with AI</span>
          </button>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            variant="outline"
            className="glass-btn-secondary border-white/15 text-slate-200 hover:text-white rounded-xl text-xs sm:text-sm h-10 px-4"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Manual
          </Button>
        </div>
      </div>

      <QuestionsList questions={questions} />

      <AddQuestionDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
      <AiQuestionGeneratorModal isOpen={isAiGeneratorOpen} onClose={() => setIsAiGeneratorOpen(false)} />
    </div>
  )
}
