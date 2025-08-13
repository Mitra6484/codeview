"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import {
  PlayIcon,
  LoaderIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertTriangleIcon,
  BrainIcon,
  CrownIcon,
  LockIcon,
} from "lucide-react"
import { executeCode } from "@/actions/execute-code"
import { analyzeCode } from "@/actions/analyze-code"
import { LANGUAGES } from "@/constants"
import { useSubscription } from "@/hooks/useSubscription"
import { useUserRole } from "@/hooks/useUserRole"
import { useCall } from "@stream-io/video-react-sdk"
import toast from "react-hot-toast"

interface CodeEditorProps {
  onAnalysisResult?: (result: any) => void
  isVisible?: boolean
  onToggleVisibility?: () => void
  currentQuestion?: {
    _id: string
    title: string
    description: string
    examples: Array<{
      input: string
      output: string
      explanation?: string
    }>
    constraints?: string[]
    supportedLanguages: string[]
    starterCode: Record<string, string>
  }
}

interface ExecutionResult {
  success: boolean
  output?: string
  error?: string
  executionTime?: number
}

interface AnalysisResult {
  isPlagiarized: boolean
  confidence: number
  sources: string[]
  explanation: string
  suggestions: string[]
}

export default function CodeEditor({
  onAnalysisResult,
  isVisible = true,
  onToggleVisibility,
  currentQuestion,
}: CodeEditorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState("javascript")
  const [code, setCode] = useState("")
  const [isExecuting, setIsExecuting] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [activeTab, setActiveTab] = useState("editor")

  const { isPremium } = useSubscription()
  const { isInterviewer } = useUserRole()
  const call = useCall()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Load starter code when question or language changes
  useEffect(() => {
    if (currentQuestion?.starterCode) {
      const starterCode = currentQuestion.starterCode[selectedLanguage]
      if (starterCode) {
        setCode(starterCode)
      }
    }
  }, [currentQuestion, selectedLanguage])

  // Broadcast code changes to other participants
  useEffect(() => {
    if (call) {
      const timeoutId = setTimeout(() => {
        call.sendCustomEvent({
          type: "code-changed",
          data: {
            code,
            language: selectedLanguage,
            timestamp: Date.now(),
          },
        })
      }, 1000) // Debounce for 1 second

      return () => clearTimeout(timeoutId)
    }
  }, [code, selectedLanguage, call])

  // Listen for code changes from other participants
  useEffect(() => {
    if (!call) return

    const handleCodeChange = (event: any) => {
      if (event.type === "code-changed" && !isInterviewer) {
        // Only sync code for non-interviewers (candidates)
        setCode(event.data.code)
        setSelectedLanguage(event.data.language)
      }
    }

    const handleExecutionResult = (event: any) => {
      if (event.type === "execution-result") {
        setExecutionResult(event.data)
        setActiveTab("output")
      }
    }

    const handleAnalysisResult = (event: any) => {
      if (event.type === "analysis-result") {
        setAnalysisResult(event.data)
        setActiveTab("analysis")
        onAnalysisResult?.(event.data)
      }
    }

    call.on("custom", handleCodeChange)
    call.on("custom", handleExecutionResult)
    call.on("custom", handleAnalysisResult)

    return () => {
      call.off("custom", handleCodeChange)
      call.off("custom", handleExecutionResult)
      call.off("custom", handleAnalysisResult)
    }
  }, [call, isInterviewer, onAnalysisResult])

  const handleExecuteCode = async () => {
    if (!code.trim()) {
      toast.error("Please write some code first")
      return
    }

    setIsExecuting(true)
    setExecutionResult(null)

    try {
      const result = await executeCode({ code, language: selectedLanguage as "javascript" | "python" | "java" })
      setExecutionResult(result)
      setActiveTab("output")

      // Broadcast execution result to all participants
      if (call) {
        call.sendCustomEvent({
          type: "execution-result",
          data: result,
        })
      }

      if (result.success) {
        toast.success("Code executed successfully!")
      } else {
        toast.error("Code execution failed")
      }
    } catch (error) {
      const errorResult = {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }
      setExecutionResult(errorResult)
      setActiveTab("output")
      toast.error("Failed to execute code")
    } finally {
      setIsExecuting(false)
    }
  }

  const handleAnalyzeCode = async () => {
    if (!isPremium) {
      toast.error("AI Analysis is a premium feature. Please upgrade your plan.")
      return
    }

    if (!code.trim()) {
      toast.error("Please write some code first")
      return
    }

    setIsAnalyzing(true)
    setAnalysisResult(null)

    try {
      const result = await analyzeCode({ 
        code, 
        language: selectedLanguage, 
        questionTitle: currentQuestion?.title || "Code Analysis",
        questionDescription: currentQuestion?.description || "Code submitted for analysis"
      })
      
      // Transform the result to match our local AnalysisResult interface
      const transformedResult: AnalysisResult = {
        isPlagiarized: result.isPlagiarized,
        confidence: result.confidence,
        sources: [], // CodeAnalysisResult doesn't have sources
        explanation: result.reasoning,
        suggestions: result.suggestions ? [result.suggestions] : []
      }
      
      setAnalysisResult(transformedResult)
      setActiveTab("analysis")

      // Broadcast analysis result to all participants
      if (call) {
        call.sendCustomEvent({
          type: "analysis-result",
          data: result,
        })
      }

      onAnalysisResult?.(result)

      if (result.isPlagiarized) {
        toast.error(`Potential plagiarism detected (${result.confidence}% confidence)`)
      } else {
        toast.success("Code analysis completed - No plagiarism detected")
      }
    } catch (error) {
      toast.error("Failed to analyze code")
      console.error("Analysis error:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Tab") {
      e.preventDefault()
      const textarea = textareaRef.current
      if (textarea) {
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const newCode = code.substring(0, start) + "  " + code.substring(end)
        setCode(newCode)

        // Set cursor position after the inserted spaces
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 2
        }, 0)
      }
    }
  }

  if (!isVisible) return null

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b bg-muted/50">
        <div className="flex items-center gap-2">
          <h3 className="font-medium">Code Editor</h3>
          {isPremium && (
            <Badge variant="secondary" className="text-xs">
              <CrownIcon className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.id} value={lang.id}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Code Editor */}
      <div className="flex-1 flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="output">
              Output
              {executionResult && (
                <Badge variant={executionResult.success ? "default" : "destructive"} className="ml-2 text-xs">
                  {executionResult.success ? "✓" : "✗"}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="analysis">
              AI Analysis
              {!isPremium && <LockIcon className="w-3 h-3 ml-1" />}
              {analysisResult && (
                <Badge variant={analysisResult.isPlagiarized ? "destructive" : "default"} className="ml-2 text-xs">
                  {analysisResult.isPlagiarized ? "⚠" : "✓"}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="flex-1 flex flex-col mt-0">
            <div className="flex-1 p-3">
              <Textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Write your ${selectedLanguage} code here...`}
                className="h-full font-mono text-sm resize-none"
                style={{ minHeight: "400px" }}
              />
            </div>
            <div className="p-3 border-t bg-muted/50">
              <div className="flex gap-2">
                <Button onClick={handleExecuteCode} disabled={isExecuting || !code.trim()} className="flex-1">
                  {isExecuting ? (
                    <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <PlayIcon className="w-4 h-4 mr-2" />
                  )}
                  Run Code
                </Button>
                <Button
                  onClick={handleAnalyzeCode}
                  disabled={isAnalyzing || !code.trim() || !isPremium}
                  variant="outline"
                  className="flex-1 bg-transparent"
                >
                  {isAnalyzing ? (
                    <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <BrainIcon className="w-4 h-4 mr-2" />
                  )}
                  {isPremium ? "Analyze Code" : "Analyze (Premium)"}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="output" className="flex-1 mt-0">
            <div className="p-3 h-full">
              {executionResult ? (
                <Card className="h-full">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      {executionResult.success ? (
                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircleIcon className="w-4 h-4 text-red-500" />
                      )}
                      Execution {executionResult.success ? "Successful" : "Failed"}
                      {executionResult.executionTime && (
                        <Badge variant="outline" className="ml-auto">
                          {executionResult.executionTime}ms
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="whitespace-pre-wrap text-sm bg-muted p-3 rounded-md overflow-auto max-h-80">
                      {executionResult.success ? executionResult.output : executionResult.error}
                    </pre>
                  </CardContent>
                </Card>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <PlayIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Run your code to see the output here</p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="flex-1 mt-0">
            <div className="p-3 h-full">
              {!isPremium ? (
                <Card className="h-full">
                  <CardContent className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <LockIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-medium mb-2">Premium Feature</h3>
                      <p className="text-muted-foreground mb-4">
                        AI-powered code analysis and plagiarism detection is available for premium subscribers.
                      </p>
                      <Button onClick={() => window.open("/pricing", "_blank")}>
                        <CrownIcon className="w-4 h-4 mr-2" />
                        Upgrade to Premium
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : analysisResult ? (
                <Card className="h-full">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      {analysisResult.isPlagiarized ? (
                        <AlertTriangleIcon className="w-4 h-4 text-red-500" />
                      ) : (
                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                      )}
                      Analysis Results
                      <Badge variant={analysisResult.isPlagiarized ? "destructive" : "default"} className="ml-auto">
                        {analysisResult.confidence}% Confidence
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 overflow-auto max-h-80">
                    {analysisResult.isPlagiarized && (
                      <Alert variant="destructive">
                        <AlertTriangleIcon className="h-4 w-4" />
                        <AlertDescription>
                          Potential plagiarism detected with {analysisResult.confidence}% confidence.
                        </AlertDescription>
                      </Alert>
                    )}

                    <div>
                      <h4 className="font-medium mb-2">Analysis</h4>
                      <p className="text-sm text-muted-foreground">{analysisResult.explanation}</p>
                    </div>

                    {analysisResult.sources.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Potential Sources</h4>
                        <ul className="text-sm space-y-1">
                          {analysisResult.sources.map((source, index) => (
                            <li key={index} className="text-muted-foreground">
                              • {source}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {analysisResult.suggestions.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Suggestions</h4>
                        <ul className="text-sm space-y-1">
                          {analysisResult.suggestions.map((suggestion, index) => (
                            <li key={index} className="text-muted-foreground">
                              • {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <BrainIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Analyze your code to see AI insights here</p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
