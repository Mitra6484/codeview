"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { UserCheckIcon, ClockIcon } from "lucide-react"

interface ManualReviewAlertProps {
  isOpen: boolean
  requestData: {
    requesterName: string
    code: string
    reason: string
    timestamp: number
  }
  onDismiss: () => void
}

export default function ManualReviewAlert({ isOpen, requestData, onDismiss }: ManualReviewAlertProps) {
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString()
  }

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <UserCheckIcon className="h-5 w-5 text-blue-500" />
            Manual Review Requested
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <ClockIcon className="h-3 w-3" />
                  {formatTime(requestData.timestamp)}
                </Badge>
                <span className="text-sm">
                  Requested by: <strong>{requestData.requesterName}</strong>
                </span>
              </div>

              <div>
                <p className="font-medium mb-2">Reason for Review:</p>
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-sm">{requestData.reason}</p>
                </div>
              </div>

              <div>
                <p className="font-medium mb-2">Code in Question:</p>
                <pre className="text-xs bg-background p-3 rounded border overflow-x-auto max-h-40">
                  {requestData.code}
                </pre>
              </div>

              <div className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                <p>
                  <strong>Action Required:</strong> Please manually review the flagged code and the candidate's
                  explanation. Consider the context and determine if the plagiarism detection was accurate.
                </p>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onDismiss}>Acknowledge Review Request</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
