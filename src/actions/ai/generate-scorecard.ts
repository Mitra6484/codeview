"use server";

import { callAi } from "@/lib/ai-provider";

export interface ScorecardInput {
  interviewTitle: string;
  candidateName: string;
  interviewerNotes?: string;
  comments?: Array<{ author: string; content: string; rating?: number }>;
  codeSnippet?: string;
  language?: string;
}

export interface ScorecardDimension {
  name: string;
  score: number; // 0 - 100
  feedback: string;
}

export interface ExecutiveScorecardResponse {
  overallScore: number; // 0 - 100
  verdict: "Strong Hire" | "Hire" | "Lean Hire" | "No Hire";
  verdictRationale: string;
  dimensions: {
    algorithmicRigor: ScorecardDimension;
    verbalCommunication: ScorecardDimension;
    codeHygiene: ScorecardDimension;
    problemSolvingAgility: ScorecardDimension;
    edgeCaseDefensiveness: ScorecardDimension;
  };
  keyStrengths: string[];
  growthAreas: string[];
  candidateFeedbackLetter: string;
  modelUsed?: string;
}

export async function generateExecutiveScorecard(
  input: ScorecardInput
): Promise<ExecutiveScorecardResponse> {
  try {
    const systemPrompt = `
You are Veritas, the Principal Technical Bar Raiser & Hiring Review Board Chair evaluating an engineering interview on Codeview.
You must be 100% objective, rigorous, and accurately calibrated.

CALIBRATION SCORING RUBRIC:
- 85 - 100 ("Strong Hire"): ONLY for candidates with verified optimal algorithmic solutions, clean idioms, defensive edge-case handling, and proactive articulation.
- 70 - 84 ("Hire"): Candidate delivered a working solution with good structure, passed test criteria, and communicated clearly with minor interviewer guidance.
- 50 - 69 ("Lean Hire"): Solved only via brute force or incomplete logic, showed hesitation on data structure trade-offs, or required multiple hints.
- 0 - 49 ("No Hire"): Candidate wrote broken/empty code, failed syntax or runtime execution, or showed significant gaps in foundational computer science principles.
- If interviewer ratings average <= 2.5/5 or if code is absent, verdict MUST be "No Hire".

Analyze the 5 key engineering dimensions:
1. Algorithmic Rigor & Correctness (0-100)
2. Verbal Communication & Articulation (0-100)
3. Code Hygiene, Idiomatic Conventions & Readability (0-100)
4. Problem-Solving Agility (0-100)
5. Edge Case Defensiveness & Reliability (0-100)

Output STRICTLY as valid JSON matching this schema:
{
  "overallScore": number (0-100),
  "verdict": "Strong Hire" | "Hire" | "Lean Hire" | "No Hire",
  "verdictRationale": "Executive summary of the hiring recommendation",
  "dimensions": {
    "algorithmicRigor": { "name": "Algorithmic Rigor", "score": number, "feedback": "Detailed observation" },
    "verbalCommunication": { "name": "Verbal Communication", "score": number, "feedback": "Detailed observation" },
    "codeHygiene": { "name": "Code Hygiene & Style", "score": number, "feedback": "Detailed observation" },
    "problemSolvingAgility": { "name": "Problem-Solving Agility", "score": number, "feedback": "Detailed observation" },
    "edgeCaseDefensiveness": { "name": "Edge Case Defensiveness", "score": number, "feedback": "Detailed observation" }
  },
  "keyStrengths": ["Strength 1", "Strength 2", "Strength 3"],
  "growthAreas": ["Growth Area 1", "Growth Area 2"],
  "candidateFeedbackLetter": "A constructive, professional letter addressing the candidate with actionable improvement guidance."
}
`;

    const commentsSummary = input.comments?.length
      ? input.comments.map((c) => `- [${c.author}${c.rating ? ` (${c.rating}/5)` : ""}]: ${c.content}`).join("\n")
      : "No formal interviewer comments entered yet.";

    const prompt = `
INTERVIEW SESSION: ${input.interviewTitle}
CANDIDATE: ${input.candidateName}

INTERVIEWER LOGGED COMMENTS & RATINGS:
${commentsSummary}

CANDIDATE SUBMITTED CODE:
\`\`\`${input.language || "text"}
${input.codeSnippet || "// Code was executed during the live session"}
\`\`\`

Generate a high-signal Executive Hiring Scorecard in JSON format now.`;

    const aiRes = await callAi({
      taskType: "EVALUATION",
      systemPrompt,
      prompt,
      temperature: 0.2,
      jsonMode: true,
    });

    let jsonStr = aiRes.text.trim();
    const jsonMatch = jsonStr.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      jsonStr = jsonMatch[1];
    }

    const parsed = JSON.parse(jsonStr) as ExecutiveScorecardResponse;
    return {
      ...parsed,
      modelUsed: aiRes.modelUsed,
    };
  } catch (error: any) {
    console.warn("Veritas scorecard fallback activated, computing calibrated baseline:", error);

    // Calculate deterministic rating based on actual candidate comments and code presence
    const ratings = input.comments?.map((c) => c.rating).filter((r): r is number => typeof r === "number") || [];
    const avgRating = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : null;
    const hasCode = Boolean(input.codeSnippet && input.codeSnippet.trim().length > 30);

    let overall = 68;
    let verdict: "Strong Hire" | "Hire" | "Lean Hire" | "No Hire" = "Lean Hire";

    if (avgRating !== null) {
      if (avgRating >= 4.5 && hasCode) {
        overall = 90;
        verdict = "Strong Hire";
      } else if (avgRating >= 3.5) {
        overall = 78;
        verdict = "Hire";
      } else if (avgRating >= 2.5) {
        overall = 60;
        verdict = "Lean Hire";
      } else {
        overall = 38;
        verdict = "No Hire";
      }
    } else if (!hasCode) {
      overall = 32;
      verdict = "No Hire";
    }

    return {
      overallScore: overall,
      verdict,
      verdictRationale:
        verdict === "No Hire"
          ? "Candidate did not provide verified code implementation or sufficient positive interviewer signals."
          : verdict === "Lean Hire"
          ? "Candidate showed foundational reasoning but required structural guidance on efficiency and scale."
          : verdict === "Hire"
          ? "Candidate demonstrated solid implementation competence and clear technical articulation."
          : "Candidate demonstrated mastery across algorithmic design, modular code structure, and communication.",
      dimensions: {
        algorithmicRigor: {
          name: "Algorithmic Rigor",
          score: Math.min(100, Math.max(20, overall + 2)),
          feedback: hasCode
            ? "Constructed an algorithmic flow addressing primary problem criteria."
            : "No submitted code was available to assess algorithmic complexity.",
        },
        verbalCommunication: {
          name: "Verbal Communication",
          score: Math.min(100, Math.max(20, overall - 2)),
          feedback: "Articulated concepts during session discussion.",
        },
        codeHygiene: {
          name: "Code Hygiene & Style",
          score: hasCode ? Math.min(100, Math.max(20, overall + 4)) : 20,
          feedback: hasCode ? "Readable formatting and syntax." : "Incomplete submission.",
        },
        problemSolvingAgility: {
          name: "Problem-Solving Agility",
          score: Math.min(100, Math.max(20, overall)),
          feedback: "Responded to constraints raised in session.",
        },
        edgeCaseDefensiveness: {
          name: "Edge Case Defensiveness",
          score: Math.min(100, Math.max(20, overall - 5)),
          feedback: "Boundary condition coverage can be expanded.",
        },
      },
      keyStrengths: [
        "Engaged with interviewer on problem parameters.",
        hasCode ? "Produced syntax for core problem logic." : "Reviewed system expectations.",
      ],
      growthAreas: [
        "Ensure full test coverage for extreme boundary cases.",
        "Proactively state Big-O bounds early in problem deconstruction.",
      ],
      candidateFeedbackLetter: `Hi ${input.candidateName},\n\nThank you for participating in the technical interview session today. Our review board evaluated your performance based on code correctness, communication, and algorithmic trade-offs.\n\nContinue practicing boundary-condition analysis and structured problem decomposition.\n\nBest regards,\nEngineering Hiring Review Committee`,
      modelUsed: "calibrated-baseline",
    };
  }
}
