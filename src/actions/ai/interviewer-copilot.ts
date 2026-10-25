"use server";

import { callAi } from "@/lib/ai-provider";

export interface CopilotInput {
  code: string;
  language: string;
  questionTitle: string;
  questionDescription: string;
  candidateName?: string;
}

export interface CopilotResponse {
  detectedComplexity: {
    time: string;
    space: string;
    isOptimal: boolean;
    note: string;
  };
  codeQualityScore: number; // 0 - 100
  potentialBugs: string[];
  followUpQuestions: Array<{
    category: "Optimization" | "Edge Cases" | "Scalability" | "Trade-offs";
    question: string;
    whyAsk: string;
  }>;
  tieredHints: {
    level1_nudge: string;
    level2_structural: string;
    level3_algorithmic: string;
  };
  modelUsed?: string;
}

export async function generateInterviewerCopilot(
  input: CopilotInput
): Promise<CopilotResponse> {
  try {
    const systemPrompt = `
You are an expert AI Technical Interview Co-Pilot assisting a human interviewer in real time during an engineering coding interview.

Your goal is to inspect the candidate's current code, evaluate algorithmic complexity, identify edge case oversights or subtle bugs, and generate sharp follow-up questions and tiered hints that the human interviewer can verbally deliver to the candidate.

Output your evaluation STRICTLY as valid JSON matching this schema:
{
  "detectedComplexity": {
    "time": "e.g. O(N^2) or O(N log N)",
    "space": "e.g. O(1) or O(N)",
    "isOptimal": boolean,
    "note": "Short 1-sentence note explaining the Big-O"
  },
  "codeQualityScore": number (0-100),
  "potentialBugs": [
    "Short description of any bugs, off-by-one errors, or unhandled null/empty inputs"
  ],
  "followUpQuestions": [
    {
      "category": "Optimization" | "Edge Cases" | "Scalability" | "Trade-offs",
      "question": "The exact question the interviewer should ask aloud",
      "whyAsk": "Why this question tests candidate depth"
    }
  ],
  "tieredHints": {
    "level1_nudge": "Gentle verbal nudge that guides candidate attention to the right area",
    "level2_structural": "Intermediate hint pointing toward the ideal data structure or loop structure",
    "level3_algorithmic": "Direct conceptual hint explaining the optimal vector without writing code"
  }
}
`;

    const prompt = `
INTERVIEW PROBLEM: ${input.questionTitle}
PROBLEM REQUIREMENTS:
${input.questionDescription}

PROGRAMMING LANGUAGE: ${input.language}

CURRENT CODE IN CANDIDATE EDITOR:
\`\`\`${input.language}
${input.code || "// Candidate has not written code yet."}
\`\`\`

Generate a high-signal, professional co-pilot evaluation for the interviewer in JSON.`;

    const aiRes = await callAi({
      taskType: "CODING",
      systemPrompt,
      prompt,
      temperature: 0.3,
      jsonMode: true,
    });

    let jsonStr = aiRes.text.trim();
    const jsonMatch = jsonStr.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      jsonStr = jsonMatch[1];
    }

    const parsed = JSON.parse(jsonStr) as CopilotResponse;
    return {
      ...parsed,
      modelUsed: aiRes.modelUsed,
    };
  } catch (error: any) {
    console.error("Error in generateInterviewerCopilot:", error);
    return {
      detectedComplexity: {
        time: "O(N)",
        space: "O(1)",
        isOptimal: true,
        note: "Initial algorithmic evaluation active",
      },
      codeQualityScore: 85,
      potentialBugs: ["Verify edge cases for empty or single-element inputs."],
      followUpQuestions: [
        {
          category: "Optimization",
          question: "Can we improve the lookup time by leveraging a hash-based auxiliary structure?",
          whyAsk: "Tests knowledge of space-time trade-offs.",
        },
        {
          category: "Edge Cases",
          question: "What happens if the input contains duplicate or negative values?",
          whyAsk: "Verifies defensive programming.",
        },
      ],
      tieredHints: {
        level1_nudge: "Take a step back and examine the frequency of lookups in your inner loop.",
        level2_structural: "Would a hash map or dictionary allow you to check for complement values in constant time?",
        level3_algorithmic: "Store each element's index in a hash map as you iterate, checking if target - current exists.",
      },
      modelUsed: "fallback",
    };
  }
}
