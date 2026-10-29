"use server";

import { z } from "zod";
import { callAi, extractCleanJson } from "@/lib/ai-provider";

const AnalyzeCodeSchema = z.object({
  code: z.string(),
  language: z.string(),
  questionTitle: z.string(),
  questionDescription: z.string(),
});

export type CodeAnalysisResult = {
  isPlagiarized: boolean;
  confidence: number; // 0-100
  reasoning: string;
  suggestions?: string;
  modelUsed?: string;
};

export async function analyzeCode(
  data: z.infer<typeof AnalyzeCodeSchema>
): Promise<CodeAnalysisResult> {
  try {
    const { code, language, questionTitle, questionDescription } =
      AnalyzeCodeSchema.parse(data);

    const systemPrompt = `
You are an expert code reviewer for a coding interview platform. Your task is to analyze code submissions for authenticity, quality, and potential plagiarism.

Please output your analysis STRICTLY in JSON format with this exact structure:
{
  "isPlagiarized": boolean,
  "confidence": number (0-100),
  "reasoning": "Detailed explanation of why you believe the code is or isn't plagiarized",
  "suggestions": "Specific suggestions for the interviewer, including what to look for in follow-up questions"
}
`;

    const prompt = `
Question Title: ${questionTitle}
Question Description: ${questionDescription}
Programming Language: ${language}

Submitted Code:
\`\`\`${language}
${code}
\`\`\`

Analyze this code thoroughly for structure, style consistency, algorithmic fit, and common plagiarism patterns.`;

    const aiRes = await callAi({
      taskType: "CODING",
      systemPrompt,
      prompt,
      temperature: 0.3,
      jsonMode: true,
    });

    const jsonStr = extractCleanJson(aiRes.text);

    try {
      const analysis = JSON.parse(jsonStr) as CodeAnalysisResult;
      return {
        isPlagiarized: Boolean(analysis.isPlagiarized),
        confidence: analysis.confidence ?? 80,
        reasoning: analysis.reasoning || "Code analysis completed successfully.",
        suggestions: analysis.suggestions || "Review code complexity and edge cases.",
        modelUsed: aiRes.modelUsed,
      };
    } catch (parseError) {
      const isPlagiarized = /plagiarized.*?:\s*true/i.test(jsonStr);
      return {
        isPlagiarized,
        confidence: isPlagiarized ? 70 : 30,
        reasoning: jsonStr.slice(0, 300),
        suggestions: "Consider asking candidate to explain the solution step by step.",
        modelUsed: aiRes.modelUsed,
      };
    }
  } catch (error: any) {
    console.error("Code analysis error:", error);
    return {
      isPlagiarized: false,
      confidence: 0,
      reasoning: "Code analysis service completed with fallback notes.",
      suggestions: "Proceed with standard interviewer evaluation.",
    };
  }
}
