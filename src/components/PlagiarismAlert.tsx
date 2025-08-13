"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AlertCircleIcon } from "lucide-react"
import type { CodeAnalysisResult } from "../actions/analyze-code"
import { ScrollArea } from "./ui/scroll-area"

interface PlagiarismAlertProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  result: CodeAnalysisResult
  onRequestManualReview: () => void
  onDismiss: () => void
  canDismiss: boolean // Only candidates can dismiss
}

export function PlagiarismAlert({
  isOpen,
  onOpenChange,
  result,
  onRequestManualReview,
  onDismiss,
  canDismiss,
}: PlagiarismAlertProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={canDismiss ? onOpenChange : undefined}>
      <AlertDialogContent className="max-h-[80vh] overflow-hidden">
        <AlertDialogHeader>
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircleIcon className="h-5 w-5" />
            <AlertDialogTitle>Potential Plagiarism Detected</AlertDialogTitle>
          </div>
          <ScrollArea className="max-h-[60vh] pr-4">
            <AlertDialogDescription className="space-y-4">
              <p>
                Our AI has detected potential plagiarism in the submitted code with a confidence level of{" "}
                <span className="font-medium">{result.confidence}%</span>.
              </p>
              <div className="text-sm border-l-4 border-destructive pl-4 py-2 bg-destructive/10">
                <p className="font-medium">Analysis:</p>
                <p className="text-muted-foreground">{result.reasoning}</p>
              </div>
              {result.suggestions && (
                <div className="text-sm">
                  <p className="font-medium">Suggestions:</p>
                  <p className="text-muted-foreground">{result.suggestions}</p>
                </div>
              )}
              {canDismiss ? (
                <p>If you believe this is a false positive, you can request a manual review from the interviewers.</p>
              ) : (
                <p>The candidate can dismiss this alert or request a manual review.</p>
              )}
            </AlertDialogDescription>
          </ScrollArea>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {canDismiss ? (
            <>
              <AlertDialogCancel onClick={onDismiss}>Dismiss</AlertDialogCancel>
              <AlertDialogAction onClick={onRequestManualReview}>Request Manual Review</AlertDialogAction>
            </>
          ) : (
            <AlertDialogCancel onClick={() => onOpenChange(false)}>Close</AlertDialogCancel>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
