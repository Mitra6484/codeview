"use client"

import {
  CallControls,
  CallingState,
  CallParticipantsList,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
  useCall,
} from "@stream-io/video-react-sdk"
import {
  LayoutListIcon,
  LoaderIcon,
  UsersIcon,
  CodeIcon,
  EyeOffIcon,
  BookOpenIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./ui/resizable"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"
import EndCallButton from "./EndCallButton"
import CodeEditor from "./CodeEditor"
import { PlagiarismAlert } from "./PlagiarismAlert"
import ManualReviewAlert from "./ManualReviewAlert"
import type { CodeAnalysisResult } from "../actions/analyze-code"
import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import toast from "react-hot-toast"
import { useUserRole } from "@/hooks/useUserRole"

function MeetingRoom() {
  const router = useRouter()
  const { isInterviewer } = useUserRole()
  const [layout, setLayout] = useState<"grid" | "speaker">("speaker")
  const [showParticipants, setShowParticipants] = useState(false)
  const [showCodeEditor, setShowCodeEditor] = useState(true)
  const [showQuestion, setShowQuestion] = useState(true)
  const [isPlagiarismAlertOpen, setIsPlagiarismAlertOpen] = useState(false)
  const [isManualReviewAlertOpen, setIsManualReviewAlertOpen] = useState(false)
  const [plagiarismResult, setPlagiarismResult] = useState<CodeAnalysisResult | null>(null)
  const [currentQuestionId, setCurrentQuestionId] = useState<string>("") // Will be set when questions load
  const [isQuestionExpanded, setIsQuestionExpanded] = useState(true)
  const { useCallCallingState } = useCallStateHooks()
  const call = useCall()

  const callingState = useCallCallingState()
  const questions = useQuery(api.questions.getAllQuestions)
  const currentQuestion = questions?.find((q) => q._id === currentQuestionId) || questions?.[0]

  // Set initial question when questions load
  useEffect(() => {
    if (questions && questions.length > 0 && !currentQuestionId) {
      setCurrentQuestionId(questions[0]._id)
    }
  }, [questions, currentQuestionId])

  useEffect(() => {
    if (!call) return

    // Listen for analysis results from other participants
    const handleAnalysisResult = (event: any) => {
      if (event.type === "analysis-result") {
        const result = event.data as CodeAnalysisResult
        if (result.isPlagiarized && result.confidence > 70) {
          setPlagiarismResult(result)
          setIsPlagiarismAlertOpen(true)
        }
      }
    }

    // Listen for manual review requests
    const handleManualReviewRequest = (event: any) => {
      if (event.type === "manual-review-request") {
        setIsManualReviewAlertOpen(true)
        toast("A candidate has requested manual review of their code", {
          duration: 5000,
          icon: "⚠️",
        })
      }
    }

    // Listen for question changes
    const handleQuestionChange = (event: any) => {
      if (event.type === "question-changed") {
        setCurrentQuestionId(event.data.questionId)
        toast(`Question changed to: ${event.data.questionTitle}`, {
          duration: 3000,
          icon: "📝",
        })
      }
    }

    call.on("custom", handleAnalysisResult)
    call.on("custom", handleManualReviewRequest)
    call.on("custom", handleQuestionChange)

    return () => {
      call.off("custom", handleAnalysisResult)
      call.off("custom", handleManualReviewRequest)
      call.off("custom", handleQuestionChange)
    }
  }, [call])

  // This function will be passed to the CodeEditor component
  const handleCodeAnalysisResult = (result: CodeAnalysisResult) => {
    // Broadcast the analysis result to all participants
    if (call) {
      call.sendCustomEvent({
        type: "analysis-result",
        data: result,
      })
    }

    // If plagiarism is detected with high confidence, show the alert
    if (result.isPlagiarized && result.confidence > 70) {
      setPlagiarismResult(result)
      setIsPlagiarismAlertOpen(true)
    }
  }

  const handleRequestManualReview = () => {
    // Broadcast manual review request to all participants
    if (call) {
      call.sendCustomEvent({
        type: "manual-review-request",
        data: { timestamp: Date.now() },
      })
    }

    toast.success("Manual review request sent to all interviewers")
    setIsPlagiarismAlertOpen(false)
  }

  const handleDismissPlagiarismAlert = () => {
    setIsPlagiarismAlertOpen(false)
  }

  const handleQuestionChange = (questionId: string) => {
    const question = questions?.find((q) => q._id === questionId)
    if (question && call) {
      setCurrentQuestionId(questionId)
      // Broadcast question change to all participants
      call.sendCustomEvent({
        type: "question-changed",
        data: {
          questionId,
          questionTitle: question.title,
        },
      })
    }
  }

  if (callingState !== CallingState.JOINED) {
    return (
      <div className="h-96 flex items-center justify-center">
        <LoaderIcon className="size-6 animate-spin" />
      </div>
    )
  }

  // Show loading while questions are being fetched
  if (!questions) {
    return (
      <div className="h-96 flex items-center justify-center">
        <LoaderIcon className="size-6 animate-spin" />
        <span className="ml-2">Loading questions...</span>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-4rem-1px)]">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={showCodeEditor ? 35 : 100} minSize={25} maxSize={100} className="relative">
          {/* VIDEO LAYOUT */}
          <div className="absolute inset-0">
            {layout === "grid" ? <PaginatedGridLayout /> : <SpeakerLayout />}

            {/* PARTICIPANTS LIST OVERLAY */}
            {showParticipants && (
              <div className="absolute right-0 top-0 h-full w-[300px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 overflow-hidden">
                <div className="h-full p-4">
                  <CallParticipantsList onClose={() => setShowParticipants(false)} />
                </div>
              </div>
            )}
          </div>

          {/* VIDEO CONTROLS */}
          <div className="absolute bottom-4 left-0 right-0">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 flex-wrap justify-center px-4">
                <CallControls onLeave={() => router.push("/")} />

                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="size-10 bg-transparent">
                        <LayoutListIcon className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setLayout("grid")}>Grid View</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setLayout("speaker")}>Speaker View</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button
                    variant="outline"
                    size="icon"
                    className="size-10 bg-transparent"
                    onClick={() => setShowParticipants(!showParticipants)}
                  >
                    <UsersIcon className="size-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    className="size-10 bg-transparent"
                    onClick={() => setShowQuestion(!showQuestion)}
                    title={showQuestion ? "Hide Question" : "Show Question"}
                  >
                    <BookOpenIcon className="size-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    className="size-10 bg-transparent"
                    onClick={() => setShowCodeEditor(!showCodeEditor)}
                    title={showCodeEditor ? "Hide Code Editor" : "Show Code Editor"}
                  >
                    {showCodeEditor ? <EyeOffIcon className="size-4" /> : <CodeIcon className="size-4" />}
                  </Button>

                  <EndCallButton />
                </div>
              </div>
            </div>
          </div>
        </ResizablePanel>

        {(showCodeEditor || showQuestion) && (
          <>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={65} minSize={25}>
              <div className="h-full flex flex-col">
                                 {/* Question Panel */}
                 {showQuestion && currentQuestion && (
                  <div className="border-b bg-background">
                    <Collapsible open={isQuestionExpanded} onOpenChange={setIsQuestionExpanded}>
                      <div className="flex items-center justify-between p-3 border-b">
                        <div className="flex items-center gap-2">
                          <BookOpenIcon className="h-4 w-4" />
                          <span className="font-medium">Interview Question</span>
                          {isInterviewer && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                  Change Question
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                                               {questions?.map((question) => (
                                 <DropdownMenuItem
                                   key={question._id}
                                   onClick={() => handleQuestionChange(question._id)}
                                   className={currentQuestionId === question._id ? "bg-accent" : ""}
                                 >
                                   {question.title}
                                 </DropdownMenuItem>
                               ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{currentQuestion.title}</Badge>
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm">
                              {isQuestionExpanded ? (
                                <ChevronUpIcon className="h-4 w-4" />
                              ) : (
                                <ChevronDownIcon className="h-4 w-4" />
                              )}
                            </Button>
                          </CollapsibleTrigger>
                        </div>
                      </div>

                      <CollapsibleContent>
                        <div className="p-4 max-h-80 overflow-y-auto">
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-lg">{currentQuestion.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div>
                                <h4 className="font-medium mb-2">Description</h4>
                                <p className="text-sm text-muted-foreground whitespace-pre-line">
                                  {currentQuestion.description}
                                </p>
                              </div>

                              {currentQuestion.examples && currentQuestion.examples.length > 0 && (
                                <div>
                                  <h4 className="font-medium mb-2">Examples</h4>
                                  <div className="space-y-3">
                                    {currentQuestion.examples.map((example, index) => (
                                      <div key={index} className="bg-muted/50 p-3 rounded-md">
                                        <div className="text-sm">
                                          <div>
                                            <strong>Input:</strong> {example.input}
                                          </div>
                                          <div>
                                            <strong>Output:</strong> {example.output}
                                          </div>
                                          {example.explanation && (
                                            <div className="mt-1 text-muted-foreground">
                                              <strong>Explanation:</strong> {example.explanation}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {currentQuestion.constraints && currentQuestion.constraints.length > 0 && (
                                <div>
                                  <h4 className="font-medium mb-2">Constraints</h4>
                                  <ul className="text-sm text-muted-foreground space-y-1">
                                    {currentQuestion.constraints.map((constraint, index) => (
                                      <li key={index} className="flex items-start gap-2">
                                        <span className="text-primary">•</span>
                                        <span>{constraint}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                )}

                {/* Code Editor */}
                {showCodeEditor && (
                  <div className="flex-1">
                    <CodeEditor
                      onAnalysisResult={handleCodeAnalysisResult}
                      isVisible={showCodeEditor}
                      onToggleVisibility={() => setShowCodeEditor(!showCodeEditor)}
                      currentQuestion={currentQuestion}
                    />
                  </div>
                )}
              </div>
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>

      {/* Plagiarism Alert Dialog */}
      {plagiarismResult && (
        <PlagiarismAlert
          isOpen={isPlagiarismAlertOpen}
          onOpenChange={setIsPlagiarismAlertOpen}
          result={plagiarismResult}
          onRequestManualReview={handleRequestManualReview}
          onDismiss={handleDismissPlagiarismAlert}
          canDismiss={!isInterviewer} // Only candidates can dismiss
        />
      )}

             {/* Manual Review Alert Dialog */}
       <ManualReviewAlert 
         isOpen={isManualReviewAlertOpen} 
         requestData={{
           requesterName: "Candidate",
           code: "Code content will be displayed here",
           reason: "Potential plagiarism detected",
           timestamp: Date.now()
         }}
         onDismiss={() => setIsManualReviewAlertOpen(false)} 
       />
    </div>
  )
}
export default MeetingRoom
