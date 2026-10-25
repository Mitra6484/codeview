"use server";

import { callAi } from "@/lib/ai-provider";

export interface GenerateQuestionInput {
  role?: string;
  topic?: string;
  difficulty: "Easy" | "Medium" | "Hard";
  languageFocus?: string;
}

export interface GeneratedQuestionResponse {
  title: string;
  description: string;
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  starterCode: {
    javascript: string;
    python: string;
    java: string;
  };
  constraints: string[];
  interviewerGuidance: string;
  expectedComplexity: {
    time: string;
    space: string;
  };
  modelUsed?: string;
}

export async function generateInterviewQuestion(
  input: GenerateQuestionInput
): Promise<GeneratedQuestionResponse> {
  try {
    const systemPrompt = `
You are a Principal Engineering Lead at a top technology company designing standard-setting coding interview challenges.

Create a high-signal, engaging, realistic coding problem tailored to the given topic and difficulty.

Output your generated challenge STRICTLY as valid JSON matching this schema:
{
  "title": "Clear Problem Title",
  "description": "Comprehensive problem statement in Markdown format explaining the task, inputs, and expected return value.",
  "examples": [
    {
      "input": "e.g. nums = [2, 7, 11, 15], target = 9",
      "output": "e.g. [0, 1]",
      "explanation": "Brief explanation of why this output is correct"
    }
  ],
  "starterCode": {
    "python": "def function_name(...):\\n    # Write your solution here\\n    pass",
    "javascript": "function functionName(...) {\\n  // Write your solution here\\n}",
    "java": "class Solution {\\n    public int[] functionName(...) {\\n        // Write your solution here\\n    }\\n}"
  },
  "constraints": [
    "e.g. 1 <= nums.length <= 10^5",
    "e.g. -10^9 <= target <= 10^9"
  ],
  "interviewerGuidance": "Internal note for the interviewer outlining the optimal approach and common pitfalls.",
  "expectedComplexity": {
    "time": "e.g. O(N)",
    "space": "e.g. O(N)"
  }
}
`;

    const prompt = `
ROLE TARGET: ${input.role || "Software Engineer"}
TOPIC: ${input.topic || "Data Structures & Algorithms"}
DIFFICULTY: ${input.difficulty}
LANGUAGE FOCUS: ${input.languageFocus || "Python & JavaScript"}

Generate an original, professional coding challenge matching this criteria in valid JSON now.`;

    const aiRes = await callAi({
      taskType: "CODING",
      systemPrompt,
      prompt,
      temperature: 0.7,
      jsonMode: true,
    });

    let jsonStr = aiRes.text.trim();
    const jsonMatch = jsonStr.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      jsonStr = jsonMatch[1];
    }

    const parsed = JSON.parse(jsonStr) as GeneratedQuestionResponse;
    return {
      ...parsed,
      modelUsed: aiRes.modelUsed,
    };
  } catch (error: any) {
    console.error("Error generating question:", error);
    return {
      title: "Concurrent Task Scheduler",
      description:
        "Given a list of scheduled tasks with arrival times and durations, return the maximum number of non-overlapping tasks that can be executed on a single worker thread.",
      examples: [
        {
          input: "tasks = [[1, 3], [2, 4], [3, 5]]",
          output: "2",
          explanation: "Task [1,3] and Task [3,5] can be run consecutively without overlap.",
        },
      ],
      starterCode: {
        python: "def max_scheduled_tasks(tasks):\n    # Write your solution here\n    pass",
        javascript: "function maxScheduledTasks(tasks) {\n  // Write your solution here\n}",
        java: "class Solution {\n    public int maxScheduledTasks(int[][] tasks) {\n        return 0;\n    }\n}",
      },
      constraints: ["1 <= tasks.length <= 10^5", "0 <= start < end <= 10^9"],
      interviewerGuidance: "Tests greedy interval scheduling. Optimal solution sorts by end time.",
      expectedComplexity: {
        time: "O(N log N)",
        space: "O(1)",
      },
      modelUsed: "fallback",
    };
  }
}
