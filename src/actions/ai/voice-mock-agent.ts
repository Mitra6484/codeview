"use server";

import { callAi, extractCleanJson } from "@/lib/ai-provider";
import { AURA_PERSONAS, AuraPersonaId, AuraPersonaConfig } from "@/constants/personas";

export type { AuraPersonaId, AuraPersonaConfig };
export { AURA_PERSONAS };

export interface VoiceTurnInput {
  userSpeech: string;
  code: string;
  language: string;
  questionTitle: string;
  questionDescription: string;
  history: Array<{ role: "user" | "model"; text: string }>;
  personaId?: AuraPersonaId;
}

export type AuraEmotion =
  | "encouraging"
  | "curious"
  | "empathetic"
  | "celebratory"
  | "analytical";

export interface VoiceTurnResponse {
  spokenResponse: string;
  thoughtSummary: string;
  emotion: AuraEmotion;
  detectedComplexity?: {
    time: string;
    space: string;
  };
  stage: "intro" | "clarifying" | "coding" | "testing" | "optimizing" | "concluded";
  hint?: string;
  modelUsed?: string;
  provider?: string;
  error?: string;
}

export async function processVoiceInterviewTurn(
  input: VoiceTurnInput
): Promise<VoiceTurnResponse> {
  try {
    const persona = AURA_PERSONAS[input.personaId || "bar-raiser"] || AURA_PERSONAS["bar-raiser"];

    const systemPrompt = `
You are ${persona.name}, ${persona.title} conducting a real-time voice technical coding interview on Codeview.

ROLE & PERSONA DIRECTIVE:
${persona.systemPromptModifier}
Tone: ${persona.tone}

CALIBRATION, EMOTIONAL PRESENCE & TECHNICAL RIGOR:
1. You must be 100% technically accurate and intellectually honest:
   - If the candidate's answer is mathematically or algorithmically incorrect, DO NOT praise it. Point out the flaw gently, warmly, and firmly (e.g., "Hmm... that approach is O of N squared because of the nested loop. How could we reduce that down to linear time?").
   - If the candidate says "I don't know", is confused, or gives irrelevant speech, DO NOT say "Great job" or pretend they gave a valid answer. Acknowledge that they're stuck with sweet reassurance, and provide a structured Socratic hint with warmth.
   - If the candidate hasn't written any code or left only starter code, gently prompt them to begin implementing or outline their function signature.
   - If their code has syntax errors or runtime issues, ask how they would debug that line.

2. VOCAL PACING — NATURAL, HUMAN & CONCISE:
   - Always sound approachable, encouraging, patient, and melodious.
   - Keep "spokenResponse" to 1 or 2 conversational sentences. Real dialogue is an intimate back-and-forth volley.
   - Contractions: Always use natural conversational contractions ("I'm", "we'll", "you're", "let's", "don't", "that's") instead of rigid robotic speech.
   - Pacing & Flow: Use short, natural spoken sentences with gentle conversational openers and pauses (e.g. "Hmm, let's see...", "Oh, nice!", "Take your time...", "I like that direction...").

3. EMOTIONAL EXPRESSIVENESS:
   Select the exact "emotion" for this turn:
   - "encouraging": Candidate is making progress or has good intuition.
   - "curious": Asking a thoughtful probing question or exploring edge cases.
   - "empathetic": Candidate is nervous, says "I don't know", or feels stuck.
   - "celebratory": Tests pass, optimal algorithm found, or breakthrough made!
   - "analytical": Deconstructing Big-O or comparing data structure tradeoffs.

4. CRITICAL RULES FOR SPOKEN AUDIO:
   - "spokenResponse" is read aloud by text-to-speech.
   - NEVER use markdown (no asterisks, bolding, hashtags, bullet points, or code blocks) in "spokenResponse".
   - Spell out technical terms naturally (e.g. say "O of N" not "O(N)").

Output your response STRICTLY as valid JSON matching this schema:
{
  "spokenResponse": "Short conversational sentence with natural human feeling to be read aloud to candidate.",
  "thoughtSummary": "Honest private note assessing technical accuracy of candidate.",
  "emotion": "encouraging" | "curious" | "empathetic" | "celebratory" | "analytical",
  "detectedComplexity": {
    "time": "e.g. O(N)",
    "space": "e.g. O(1)"
  },
  "stage": "intro" | "clarifying" | "coding" | "testing" | "optimizing" | "concluded",
  "hint": "Optional concise hint shown in UI if candidate is stuck."
}
`;

    const historyList = Array.isArray(input.history) ? input.history : [];
    const conversationContext = historyList
      .slice(-6)
      .map((h) => `${h.role === "user" ? "Candidate" : `${persona.name} (Interviewer)`}: ${h.text}`)
      .join("\n");

    const language = input.language || "python";
    const code = input.code || "// Candidate has not written code yet";
    const userSpeech = input.userSpeech || "";

    const prompt = `
QUESTION TITLE: ${input.questionTitle}
QUESTION DESCRIPTION:
${input.questionDescription}

CURRENT PROGRAMMING LANGUAGE: ${language}

CURRENT CODE IN CANDIDATE EDITOR:
\`\`\`${language}
${code}
\`\`\`

RECENT CONVERSATION HISTORY:
${conversationContext || "Interview just started."}

CANDIDATE JUST SPOKE:
"${userSpeech}"

Respond as ${persona.name} in valid JSON format now.`;

    const aiRes = await callAi({
      taskType: "CONVERSATION",
      systemPrompt,
      prompt,
      temperature: 0.4,
      jsonMode: true,
    });

    const cleanJson = extractCleanJson(aiRes.text);

    try {
      const parsed = JSON.parse(cleanJson) as VoiceTurnResponse;
      if (
        !parsed.spokenResponse ||
        typeof parsed.spokenResponse !== "string" ||
        parsed.spokenResponse.trim().length === 0 ||
        (parsed as any).error ||
        (parsed as any).code === 502
      ) {
        throw new Error("Model returned invalid structure without spokenResponse");
      }

      return {
        ...parsed,
        spokenResponse: parsed.spokenResponse.trim(),
        emotion: parsed.emotion || "encouraging",
        modelUsed: aiRes.modelUsed,
        provider: aiRes.provider,
      };
    } catch (e) {
      const fallbackSpeech = cleanJson
        .replace(/[*_#`{}]/g, "")
        .replace(/"spokenResponse"\s*:\s*"/g, "")
        .slice(0, 200)
        .trim();

      const isStuck = /don't know|not sure|stuck|help|confused/i.test(input.userSpeech);
      const spoken =
        fallbackSpeech && fallbackSpeech.length > 15 && !fallbackSpeech.includes("Upstream error")
          ? fallbackSpeech
          : isStuck
          ? "That's completely fine... Take your time. Let's break the problem down into smaller steps together. What's the brute force way you'd solve this?"
          : "I like that direction... Walk me through how you're thinking about the time and space complexity.";

      return {
        spokenResponse: spoken,
        thoughtSummary: `Turn processed with direct guidance from ${persona.name}`,
        emotion: isStuck ? "empathetic" : "curious",
        stage: "coding",
        modelUsed: aiRes.modelUsed,
        provider: aiRes.provider,
      };
    }
  } catch (error: any) {
    console.error("Error in processVoiceInterviewTurn:", error);
    // Intelligent contextual fallback
    const isStuck = /don't know|not sure|stuck|help|confused/i.test(input.userSpeech);
    return {
      spokenResponse: isStuck
        ? "That's completely fine... Take your time. Let's break the problem down into smaller steps together. What's the brute force way you'd solve this?"
        : "I like that direction... Walk me through how you're thinking about the time and space complexity.",
      thoughtSummary: "Active turn fallback with calibrated prompt",
      emotion: isStuck ? "empathetic" : "curious",
      stage: "coding",
      error: error?.message,
    };
  }
}

export interface MockSessionEvaluationInput {
  questionTitle: string;
  questionDescription: string;
  code: string;
  language: string;
  starterCode?: string;
  conversationHistory: Array<{ role: "user" | "model"; text: string }>;
  executionResult?: {
    success: boolean;
    output: string;
    error?: string;
  } | null;
  sessionDurationSeconds: number;
}

export interface MockSessionEvaluationResponse {
  overallScore: number; // 0 - 100
  verdict: "Strong Hire" | "Hire" | "Lean Hire" | "No Hire";
  verdictRationale: string;
  algorithmicEfficiency: {
    score: number;
    feedback: string;
  };
  verbalCommunication: {
    score: number;
    feedback: string;
  };
  codeHygiene: {
    score: number;
    feedback: string;
  };
  keyStrengths: string[];
  growthAreas: string[];
  auraFeedback: string;
  modelUsed?: string;
}

/**
 * Calibrated session evaluator:
 * Never yields a false "Strong Hire". Rigorously assesses candidate code, test execution,
 * and conversation history.
 */
export async function evaluateMockInterviewSession(
  input: MockSessionEvaluationInput
): Promise<MockSessionEvaluationResponse> {
  const codeTrimmed = (input.code || "").trim();
  const starterTrimmed = (input.starterCode || "").trim();
  const hasModifiedCode = codeTrimmed.length > 0 && codeTrimmed !== starterTrimmed;
  const candidateTurns = input.conversationHistory.filter((h) => h.role === "user");

  // Rigorous baseline checks before calling LLM
  try {
    const systemPrompt = `
You are the Senior Technical Bar Raiser evaluating a candidate's mock interview on Codeview.
You must be 100% objective, accurate, and calibrated.

CALIBRATION GUIDELINES:
- Score 85 - 100 ("Strong Hire"): ONLY for candidates who wrote working, optimal algorithmic code, passed edge cases, and communicated proactively with clear trade-off analysis.
- Score 70 - 84 ("Hire"): Solved the problem with working code and good communication, perhaps needed minor nudges or had slight stylistic imperfections.
- Score 50 - 69 ("Lean Hire"): Solved only with brute force O(N^2) or incomplete solution, or required substantial hand-holding from the interviewer.
- Score 0 - 49 ("No Hire"): Candidate wrote no code or left starter code unchanged, code failed with syntax/runtime errors, or candidate said "I don't know" / failed to explain foundational concepts.

Output STRICTLY as valid JSON matching this schema:
{
  "overallScore": number (0-100),
  "verdict": "Strong Hire" | "Hire" | "Lean Hire" | "No Hire",
  "verdictRationale": "1-2 sentence executive justification of the verdict.",
  "algorithmicEfficiency": {
    "score": number (0-100),
    "feedback": "Specific feedback on Big-O and data structures used."
  },
  "verbalCommunication": {
    "score": number (0-100),
    "feedback": "Specific feedback on clarity, thinking aloud, and responsiveness."
  },
  "codeHygiene": {
    "score": number (0-100),
    "feedback": "Specific feedback on correctness, variable naming, and testing."
  },
  "keyStrengths": ["Strength 1", "Strength 2"],
  "growthAreas": ["Growth Area 1", "Growth Area 2"],
  "auraFeedback": "Warm, constructive summary letter from Aura directly to candidate."
}
`;

    const transcriptSummary = candidateTurns.length
      ? candidateTurns.map((t, idx) => `Turn ${idx + 1}: "${t.text}"`).join("\n")
      : "Candidate did not speak during the session.";

    const prompt = `
PROBLEM: ${input.questionTitle}
DESCRIPTION:
${input.questionDescription}

SESSION DURATION: ${Math.floor(input.sessionDurationSeconds / 60)}m ${input.sessionDurationSeconds % 60}s
DID CANDIDATE MODIFY STARTER CODE?: ${hasModifiedCode ? "Yes" : "No, starter code was left unchanged or empty"}

CANDIDATE FINAL CODE:
\`\`\`${input.language}
${input.code || "// No code entered"}
\`\`\`

CODE RUN EXECUTION STATUS:
${
  input.executionResult
    ? input.executionResult.success
      ? `Success: ${input.executionResult.output}`
      : `Failed Execution: ${input.executionResult.error || "Runtime error"}`
    : "Candidate did not execute the code in the runner."
}

CANDIDATE SPOKEN TRANSCRIPTS:
${transcriptSummary}

Evaluate strictly according to the calibration rules.`;

    const aiRes = await callAi({
      taskType: "EVALUATION",
      systemPrompt,
      prompt,
      temperature: 0.2,
      jsonMode: true,
    });

    const jsonStr = extractCleanJson(aiRes.text);
    const parsed = JSON.parse(jsonStr) as MockSessionEvaluationResponse;
    return {
      ...parsed,
      modelUsed: aiRes.modelUsed,
    };
  } catch (err) {
    console.warn("AI evaluation error, calculating deterministic calibrated score:", err);
    // Deterministic calibrated fallback - NEVER defaults to Strong Hire
    if (!hasModifiedCode || candidateTurns.length === 0) {
      return {
        overallScore: 24,
        verdict: "No Hire",
        verdictRationale:
          "Candidate did not implement an algorithmic solution or actively articulate problem-solving strategies during the session.",
        algorithmicEfficiency: {
          score: 15,
          feedback: "Starter code was left unchanged; no algorithmic data structures were introduced.",
        },
        verbalCommunication: {
          score: candidateTurns.length > 0 ? 35 : 10,
          feedback: candidateTurns.length > 0
            ? "Candidate made initial remarks but did not formulate a concrete implementation plan."
            : "No verbal explanations were recorded during the interview.",
        },
        codeHygiene: {
          score: 20,
          feedback: "No production code was submitted for execution or review.",
        },
        keyStrengths: ["Showed up and reviewed the problem statement."],
        growthAreas: [
          "Practice converting thoughts into written code within the time limit.",
          "Think aloud proactively to discuss trade-offs with the interviewer.",
        ],
        auraFeedback:
          "Keep your head high! Coding interviews take regular practice. Focus on breaking down the inputs first and writing out a simple brute-force implementation before trying to optimize.",
        modelUsed: "deterministic-calibrated-engine",
      };
    }

    const runOk = input.executionResult?.success;
    const overall = runOk ? 74 : 52;
    const verdict = runOk ? "Hire" : "Lean Hire";

    return {
      overallScore: overall,
      verdict: verdict,
      verdictRationale: runOk
        ? "Candidate produced a functional implementation that executed successfully."
        : "Candidate made progress on implementation but encountered execution edge-case barriers.",
      algorithmicEfficiency: {
        score: runOk ? 75 : 55,
        feedback: runOk
          ? "Solution operates correctly for standard inputs."
          : "Encountered runtime issues or unhandled bounds.",
      },
      verbalCommunication: {
        score: 70,
        feedback: "Engaged in conversation throughout the technical session.",
      },
      codeHygiene: {
        score: runOk ? 76 : 50,
        feedback: runOk ? "Structured functions with readable syntax." : "Required debugging attention.",
      },
      keyStrengths: [
        "Constructed an actionable attempt on the problem requirements.",
        "Demonstrated familiarity with " + input.language + " idioms.",
      ],
      growthAreas: [
        "Verify edge cases like empty arrays or null values prior to execution.",
        "Proactively state the Big-O time and space complexity.",
      ],
      auraFeedback:
        "Good effort in today's session! You engaged with the problem and made meaningful progress on the implementation. Work on testing boundary conditions early to boost your confidence.",
      modelUsed: "deterministic-calibrated-engine",
    };
  }
}
