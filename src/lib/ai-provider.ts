import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

// OpenRouter Free Models mapped by specialized task (verified active & responsive)
export const FREE_MODELS = {
  // Ultra-responsive, natural conversational flow for Aura voice persona
  CONVERSATION: [
    "openrouter/free",
    "nvidia/nemotron-3.5-lightning:free",
    "xingchen-agi/xing4.0-29b-a4b:free",
    "poolside/laguna-s-2.1:free",
    "liquid/lfm-2.5-2.6b:free",
  ],
  // Tailored specifically for algorithmic code, syntax, Big-O, and edge cases
  CODING: [
    "openrouter/free",
    "nvidia/nemotron-3.5-lightning:free",
    "xingchen-agi/xing4.0-29b-a4b:free",
    "poolside/laguna-s-2.1:free",
  ],
  // In-depth analytical reasoning for scorecards & hiring memos
  EVALUATION: [
    "openrouter/free",
    "nvidia/nemotron-3.5-lightning:free",
    "xingchen-agi/xing4.0-29b-a4b:free",
    "poolside/laguna-s-2.1:free",
  ],
} as const;

export type TaskType = keyof typeof FREE_MODELS;

export interface AiRequestOptions {
  taskType?: TaskType;
  prompt: string;
  systemPrompt?: string;
  temperature?: number;
  jsonMode?: boolean;
}

export interface AiResponse {
  text: string;
  modelUsed: string;
  provider: "openrouter" | "gemini";
}

// Initialize OpenRouter client
function getOpenRouterClient() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return null;

  return new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: apiKey,
    defaultHeaders: {
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      "X-Title": "Codeview AI Platform",
    },
  });
}

// Initialize Gemini client fallback
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenerativeAI(apiKey);
}

/**
 * Extracts and cleans a JSON block from AI output, stripping reasoning, backticks, or prefix text.
 */
export function extractCleanJson(rawText: string): string {
  if (!rawText) return "{}";
  let text = rawText.trim();

  // Strip markdown code fences if present
  const markdownMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (markdownMatch && markdownMatch[1]) {
    text = markdownMatch[1].trim();
  }

  // Extract first { ... } block
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    text = text.substring(firstBrace, lastBrace + 1);
  }

  return text;
}

/**
 * Executes an AI completion using OpenRouter free models first,
 * with automatic model fallback, and Gemini API as secondary backup.
 */
export async function callAi(options: AiRequestOptions): Promise<AiResponse> {
  const taskType = options.taskType || "CONVERSATION";
  const candidateModels = FREE_MODELS[taskType] || FREE_MODELS.CONVERSATION;
  const openRouter = getOpenRouterClient();

  // 1. Try OpenRouter with the list of free models
  if (openRouter) {
    for (const model of candidateModels) {
      try {
        const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];

        if (options.systemPrompt) {
          messages.push({ role: "system", content: options.systemPrompt });
        }
        messages.push({ role: "user", content: options.prompt });

        const completion = await openRouter.chat.completions.create({
          model,
          messages,
          temperature: options.temperature ?? 0.7,
          response_format: options.jsonMode ? { type: "json_object" } : undefined,
        });

        const output = completion.choices[0]?.message?.content;
        if (output && output.trim().length > 0) {
          // Detect OpenRouter upstream provider error strings returned with HTTP 200
          const isUpstreamError =
            output.includes('"error_type"') ||
            output.includes('"provider_unavailable"') ||
            output.includes("ResourceExhausted") ||
            output.includes("Rate limit exceeded") ||
            (output.includes('"code":') && output.includes('"message":') && !output.includes('"spokenResponse"'));

          if (isUpstreamError) {
            console.warn(`OpenRouter model ${model} returned error payload, trying next...`);
            continue;
          }

          return {
            text: output,
            modelUsed: model,
            provider: "openrouter",
          };
        }
      } catch (err: any) {
        console.warn(`OpenRouter model ${model} temporarily unavailable:`, err?.message || err);
        // Continue to next free model in the chain
      }
    }
  }

  // 2. Fallback to Gemini API if GEMINI_API_KEY is available
  const gemini = getGeminiClient();
  if (gemini) {
    const candidateGeminiModels = ["gemini-2.5-flash", "gemini-1.5-flash-latest", "gemini-2.0-flash", "gemini-1.5-pro"];
    for (const gModel of candidateGeminiModels) {
      try {
        const model = gemini.getGenerativeModel({
          model: gModel,
          generationConfig: options.jsonMode
            ? { responseMimeType: "application/json", temperature: options.temperature ?? 0.7 }
            : { temperature: options.temperature ?? 0.7 },
          systemInstruction: options.systemPrompt,
        });

        const res = await model.generateContent(options.prompt);
        const text = res.response.text();

        if (text && text.trim().length > 0) {
          return {
            text,
            modelUsed: gModel,
            provider: "gemini",
          };
        }
      } catch (geminiErr: any) {
        console.warn(`Gemini model ${gModel} fallback failed:`, geminiErr?.message || geminiErr);
      }
    }
  }

  throw new Error(
    "No AI API provider responded successfully. Please verify OPENROUTER_API_KEY in your environment."
  );
}
