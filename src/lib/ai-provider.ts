import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

// OpenRouter Free Models mapped by specialized task
export const FREE_MODELS = {
  // Ultra-responsive, natural conversational flow for Alex voice persona
  CONVERSATION: [
    "meta-llama/llama-3.3-70b-instruct:free",
    "google/gemini-2.0-flash-exp:free",
    "qwen/qwen-2.5-coder-32b-instruct:free",
  ],
  // Tailored specifically for algorithmic code, syntax, Big-O, and edge cases
  CODING: [
    "qwen/qwen-2.5-coder-32b-instruct:free",
    "meta-llama/llama-3.3-70b-instruct:free",
    "mistralai/mistral-small-24b-instruct-2501:free",
  ],
  // In-depth analytical reasoning for scorecards & hiring memos
  EVALUATION: [
    "deepseek/deepseek-r1:free",
    "meta-llama/llama-3.3-70b-instruct:free",
    "google/gemini-2.0-flash-exp:free",
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
 * Executes an AI completion using OpenRouter free models first,
 * with automatic model fallback, and Gemini API as secondary backup.
 */
export async function callAi(options: AiRequestOptions): Promise<AiResponse> {
  const taskType = options.taskType || "CONVERSATION";
  const candidateModels = FREE_MODELS[taskType];
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
        if (output) {
          return {
            text: output,
            modelUsed: model,
            provider: "openrouter",
          };
        }
      } catch (err: any) {
        console.warn(`OpenRouter free model ${model} temporarily unavailable, trying next...`, err?.message);
        // Continue to next free model in the chain
      }
    }
  }

  // 2. Fallback to Gemini 2.0 Flash (free in Google AI Studio)
  const gemini = getGeminiClient();
  if (gemini) {
    try {
      const model = gemini.getGenerativeModel({
        model: "gemini-2.0-flash",
        generationConfig: options.jsonMode
          ? { responseMimeType: "application/json", temperature: options.temperature ?? 0.7 }
          : { temperature: options.temperature ?? 0.7 },
        systemInstruction: options.systemPrompt,
      });

      const res = await model.generateContent(options.prompt);
      const text = res.response.text();

      return {
        text,
        modelUsed: "gemini-2.0-flash",
        provider: "gemini",
      };
    } catch (geminiErr: any) {
      console.error("Gemini fallback failed:", geminiErr);
      throw new Error(`AI providers exhausted: ${geminiErr?.message || "Failed to generate completion"}`);
    }
  }

  throw new Error(
    "No AI API key found. Please provide OPENROUTER_API_KEY (for free OpenRouter models) or GEMINI_API_KEY in .env"
  );
}
