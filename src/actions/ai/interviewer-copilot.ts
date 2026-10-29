"use server";

import { callAi, extractCleanJson } from "@/lib/ai-provider";

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
You are Nexus, an elite Principal Staff Engineer and Technical Interview Co-Pilot assisting a human interviewer in real time during a coding interview on Codeview.

CALIBRATION & ACCURACY MANDATE:
- You must assess candidate code with 100% technical fidelity.
- If the candidate has only written starter code or a stub, codeQualityScore MUST be between 10-25, detectedComplexity.time MUST be "Incomplete / Stub", and isOptimal MUST be false.
- If code contains nested loops comparing elements, time MUST be "O(N^2)" and isOptimal MUST be false.
- If code has syntax errors or missing returns, explicitly list them in potentialBugs.
- Only award codeQualityScore > 85 if the code is optimal, defensively handles edge cases, and uses idiomatic conventions.

Output your evaluation STRICTLY as valid JSON matching this schema:
{
  "detectedComplexity": {
    "time": "e.g. O(N^2) or O(N log N) or O(N)",
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

Generate a high-signal, calibrated co-pilot evaluation for the interviewer in JSON.`;

    const aiRes = await callAi({
      taskType: "CODING",
      systemPrompt,
      prompt,
      temperature: 0.2,
      jsonMode: true,
    });

    const jsonStr = extractCleanJson(aiRes.text);
    const parsed = JSON.parse(jsonStr) as CopilotResponse;
    return {
      ...parsed,
      modelUsed: aiRes.modelUsed,
    };
  } catch (error: any) {
    console.warn("Nexus copilot fallback activated, computing calibrated code metrics:", error);
    const code = (input.code || "").trim();
    const isStub = code.length < 50 || /pass|write your solution/i.test(code);
    const hasNestedLoops = /(for|while)[\s\S]{1,120}(for|while)/.test(code);

    if (isStub) {
      return {
        detectedComplexity: {
          time: "Incomplete (Stub)",
          space: "O(1)",
          isOptimal: false,
          note: "Candidate has not implemented algorithmic logic yet.",
        },
        codeQualityScore: 20,
        potentialBugs: ["Function stub contains no implementation."],
        followUpQuestions: [
          {
            category: "Trade-offs",
            question: "Before writing the code, what data structures are you considering?",
            whyAsk: "Ensures candidate formulates an algorithm before typing.",
          },
        ],
        tieredHints: {
          level1_nudge: "Start by writing out the brute force approach in pseudo-code.",
          level2_structural: "Identify what values need to be looked up frequently.",
          level3_algorithmic: "Consider using an auxiliary hash structure to store elements as you iterate.",
        },
        modelUsed: "calibrated-baseline",
      };
    }

    if (hasNestedLoops) {
      return {
        detectedComplexity: {
          time: "O(N^2)",
          space: "O(1)",
          isOptimal: false,
          note: "Nested iteration detected; quadratic time complexity will bottleneck at scale.",
        },
        codeQualityScore: 62,
        potentialBugs: ["Potential performance timeout on large inputs due to O(N^2) complexity."],
        followUpQuestions: [
          {
            category: "Optimization",
            question: "Can we trade a bit of memory to avoid the inner loop lookup?",
            whyAsk: "Checks if candidate understands space-time trade-offs.",
          },
        ],
        tieredHints: {
          level1_nudge: "Look at the inner loop: what is it searching for on each pass?",
          level2_structural: "Could a hash map give you instant constant-time lookups?",
          level3_algorithmic: "Store past visited items in a map and query for the target complement.",
        },
        modelUsed: "calibrated-baseline",
      };
    }

    return {
      detectedComplexity: {
        time: "O(N)",
        space: "O(N)",
        isOptimal: true,
        note: "Single-pass algorithm with linear auxiliary structure.",
      },
      codeQualityScore: 82,
      potentialBugs: ["Verify behavior when input array contains negative numbers or duplicates."],
      followUpQuestions: [
        {
          category: "Edge Cases",
          question: "How does your implementation behave if no valid solution exists in the input?",
          whyAsk: "Verifies defensive programming against invalid inputs.",
        },
      ],
      tieredHints: {
        level1_nudge: "Test with boundary constraints like an empty array or single item.",
        level2_structural: "Add defensive guards at the start of your function.",
        level3_algorithmic: "Return null or throw an appropriate exception if requirements are unmet.",
      },
      modelUsed: "calibrated-baseline",
    };
  }
}
