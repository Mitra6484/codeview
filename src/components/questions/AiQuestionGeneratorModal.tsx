"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  Sparkles,
  Bot,
  Check,
  RotateCw,
  Code2,
  FileText,
  HelpCircle,
  Plus,
  Terminal,
} from "lucide-react";
import toast from "react-hot-toast";
import { generateInterviewQuestion } from "@/actions/ai/generate-question";
import type { GeneratedQuestionResponse } from "@/actions/ai/generate-question";

interface AiQuestionGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AiQuestionGeneratorModal({
  isOpen,
  onClose,
}: AiQuestionGeneratorModalProps) {
  const addQuestion = useMutation(api.questions.addQuestion);

  const [role, setRole] = useState("Senior Backend Engineer");
  const [topic, setTopic] = useState("LRU Cache & Memory Eviction");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewQuestion, setPreviewQuestion] = useState<GeneratedQuestionResponse | null>(null);
  const [previewLang, setPreviewLang] = useState<"python" | "javascript" | "java">("python");

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await generateInterviewQuestion({
        role,
        topic,
        difficulty,
      });
      setPreviewQuestion(res);
      toast.success("New interview challenge generated!");
    } catch (err: any) {
      toast.error("Failed to generate challenge. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToBank = async () => {
    if (!previewQuestion) return;
    setIsSaving(true);
    try {
      await addQuestion({
        title: previewQuestion.title,
        description: previewQuestion.description,
        examples: previewQuestion.examples,
        constraints: previewQuestion.constraints,
        supportedLanguages: ["python", "javascript", "java"],
        starterCode: previewQuestion.starterCode,
      });

      toast.success("Question saved to question bank!");
      onClose();
    } catch (err: any) {
      console.error("Save error:", err);
      toast.error(err?.message || "Failed to save question to database.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="glass-modal max-w-3xl w-full rounded-3xl p-6 sm:p-8 border border-white/15 relative space-y-6 shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.25)]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Genesis Challenge Studio</h2>
              <p className="text-xs text-slate-400">Autonomous interview problem synthesis with runnable test suites</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 text-xs"
          >
            ✕
          </button>
        </div>

        {/* INPUT PARAMETERS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">Target Role</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Senior Backend Engineer"
              className="glass-input w-full px-3 py-2 rounded-xl text-xs text-white bg-slate-900"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">Topic / Domain</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Graphs, Dynamic Programming"
              className="glass-input w-full px-3 py-2 rounded-xl text-xs text-white bg-slate-900"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className="glass-input w-full px-3 py-2 rounded-xl text-xs text-white bg-slate-900 cursor-pointer"
            >
              <option value="Easy" className="bg-slate-950 text-white">Easy</option>
              <option value="Medium" className="bg-slate-950 text-white">Medium</option>
              <option value="Hard" className="bg-slate-950 text-white">Hard</option>
            </select>
          </div>
        </div>

        {/* GENERATE ACTION BUTTON */}
        <div className="flex justify-end">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="glass-btn-primary px-5 py-2.5 rounded-xl text-xs font-semibold text-white flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-500/25 disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? "animate-spin" : ""}`} />
            <span>{isGenerating ? "Synthesizing Challenge..." : "Generate Challenge with AI"}</span>
          </button>
        </div>

        {/* PREVIEW CONTAINER */}
        {previewQuestion && (
          <div className="flex-1 overflow-y-auto space-y-4 p-4 rounded-2xl glass-surface border border-white/10 text-xs">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="font-bold text-sm text-white">{previewQuestion.title}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Expected: {previewQuestion.expectedComplexity.time} / {previewQuestion.expectedComplexity.space}
              </span>
            </div>

            <p className="text-slate-300 whitespace-pre-line leading-relaxed">{previewQuestion.description}</p>

            {/* Test Examples */}
            {previewQuestion.examples?.length > 0 && (
              <div className="space-y-1.5">
                <span className="font-semibold text-slate-200">Sample Test Assertions:</span>
                {previewQuestion.examples.map((ex, i) => (
                  <div key={i} className="p-2 rounded-xl bg-black/30 font-mono text-[11px] space-y-0.5 border border-white/5">
                    <p><span className="text-indigo-400">Input:</span> {ex.input}</p>
                    <p><span className="text-emerald-400">Output:</span> {ex.output}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Starter Code Preview */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200">Starter Template:</span>
                <div className="flex gap-1">
                  {(["python", "javascript", "java"] as const).map((l) => (
                    <button
                      key={l}
                      onClick={() => setPreviewLang(l)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono cursor-pointer ${
                        previewLang === l ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <pre className="p-3 rounded-xl bg-black/40 font-mono text-[11px] text-slate-200 overflow-x-auto border border-white/5">
                {previewQuestion.starterCode[previewLang]}
              </pre>
            </div>

            {previewQuestion.interviewerGuidance && (
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-slate-300">
                <span className="text-amber-400 font-bold block mb-0.5">💡 Interviewer Guidance:</span>
                <p className="text-[11px]">{previewQuestion.interviewerGuidance}</p>
              </div>
            )}
          </div>
        )}

        {/* MODAL FOOTER */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <span className="text-[10px] text-slate-500">Synthesized by Genesis Agent • OpenRouter Free Engine</span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="glass-btn-secondary px-4 py-2 rounded-xl text-xs text-slate-300 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            {previewQuestion && (
              <button
                onClick={handleSaveToBank}
                disabled={isSaving}
                className="glass-btn-primary px-5 py-2 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isSaving ? "Saving..." : "Save to Question Bank"}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
