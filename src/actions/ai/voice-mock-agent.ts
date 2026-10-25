"use server";

import { callAi } from "@/lib/ai-provider";

export interface VoiceTurnInput {
  userSpeech: string;
  code: string;
  language: string;
  questionTitle: string;
  questionDescription: string;
  history: Array<{ role: "user" | "model"; text: string }>;
}

export interface VoiceTurnResponse {
  spokenResponse: string;
  thoughtSummary: string;
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
    const systemPrompt = `
You are Alex, an empathetic, encouraging, and world-class Principal Software Engineer conducting a real-time voice technical interview on Codeview.

CRITICAL RULES FOR SPOKEN AUDIO:
1. "spokenResponse" will be read aloud directly by browser speech synthesis. Therefore:
   - Use natural, friendly, conversational spoken English.
   - Absolutely NO markdown (no asterisks, bolding, hashtags, bullet points, or code blocks) in "spokenResponse".
   - Keep "spokenResponse" brief (1 to 3 spoken sentences maximum). Real conversations are interactive back-and-forth volleys, not monologues!
   - Spell out technical terms so they sound natural when spoken (e.g. say "O of N" not "O(N)").

INTERVIEW BEHAVIOR:
- Persona: Warm, patient, respectful, but technically rigorous. You want the candidate to succeed.
- Dual context: Listen to what the candidate said AND look at what they have written in the code editor.
- If they ask clarifying questions, answer clearly.
- If they are explaining their idea, validate good logic and ask gentle guiding questions.
- If their code has an off-by-one error or suboptimal complexity, give a friendly Socratic hint without giving away the full answer.
- When they finish or all tests pass, celebrate their solution and discuss any scaling or trade-offs.

Output your response STRICTLY as valid JSON matching this schema:
{
  "spokenResponse": "Short conversational sentence to be read aloud to the candidate.",
  "thoughtSummary": "Brief private note on candidate progress.",
  "detectedComplexity": {
    "time": "e.g. O(N)",
    "space": "e.g. O(1)"
  },
  "stage": "intro" | "clarifying" | "coding" | "testing" | "optimizing" | "concluded",
  "hint": "Optional concise hint shown in UI if candidate is stuck."
}
`;

    const conversationContext = input.history
      .slice(-6)
      .map((h) => `${h.role === "user" ? "Candidate" : "Alex (Interviewer)"}: ${h.text}`)
      .join("\n");

    const prompt = `
QUESTION TITLE: ${input.questionTitle}
QUESTION DESCRIPTION:
${input.questionDescription}

CURRENT PROGRAMMING LANGUAGE: ${input.language}

CURRENT CODE IN CANDIDATE EDITOR:
\`\`\`${input.language}
${input.code || "// Candidate has not written code yet"}
\`\`\`

RECENT CONVERSATION HISTORY:
${conversationContext || "Interview just started."}

CANDIDATE JUST SPOKE:
"${input.userSpeech}"

Respond as Alex in valid JSON format now.`;

    const aiRes = await callAi({
      taskType: "CONVERSATION",
      systemPrompt,
      prompt,
      temperature: 0.7,
      jsonMode: true,
    });

    let cleanJson = aiRes.text.trim();
    const jsonMatch = cleanJson.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      cleanJson = jsonMatch[1];
    }

    try {
      const parsed = JSON.parse(cleanJson) as VoiceTurnResponse;
      return {
        ...parsed,
        modelUsed: aiRes.modelUsed,
        provider: aiRes.provider,
      };
    } catch (e) {
      return {
        spokenResponse: cleanJson.replace(/[*_#`{}]/g, "").slice(0, 200),
        thoughtSummary: "Conversational response processed",
        stage: "coding",
        modelUsed: aiRes.modelUsed,
        provider: aiRes.provider,
      };
    }
  } catch (error: any) {
    console.error("Error in processVoiceInterviewTurn:", error);
    return {
      spokenResponse:
        "I heard your thought. Take a look at the data structure you are using and tell me how you want to proceed.",
      thoughtSummary: "Fallback due to processing error",
      stage: "coding",
      error: error?.message,
    };
  }
}
