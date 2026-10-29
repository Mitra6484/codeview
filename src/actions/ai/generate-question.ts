"use server";

import { callAi, extractCleanJson } from "@/lib/ai-provider";

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
You are Genesis, the Principal Challenge Studio Architect designing production-grade coding interview problems for Codeview.

CALIBRATION & VALIDITY REQUIREMENTS:
- Problem statements must be unambiguous, mathematically correct, and feature strict typing.
- Examples must be 100% verified: the output MUST strictly match what the input computes.
- Starter code templates MUST be syntactically valid in Python, JavaScript, and Java.
- Difficulty Calibration:
  * "Easy": Straightforward single-pass arrays/hashmaps/strings (e.g., Two Sum, Valid Anagram).
  * "Medium": Two pointers, sliding window, binary search, trees, or BFS/DFS (e.g., Longest Substring Without Repeating Characters, Coin Change).
  * "Hard": Advanced dynamic programming, monotonic stacks, graph topological sorts, or trie union-find.

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
      temperature: 0.35,
      jsonMode: true,
    });

    const jsonStr = extractCleanJson(aiRes.text);
    const parsed = JSON.parse(jsonStr) as GeneratedQuestionResponse;
    return {
      ...parsed,
      modelUsed: aiRes.modelUsed,
    };
  } catch (error: any) {
    console.warn("Genesis question fallback activated, returning calibrated problem:", error);
    if (input.difficulty === "Easy") {
      return {
        title: "Valid Anagram String",
        description:
          "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.\n\nAn **Anagram** is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.",
        examples: [
          {
            input: 's = "anagram", t = "nagaram"',
            output: "true",
            explanation: "Both strings contain identical character counts.",
          },
          {
            input: 's = "rat", t = "car"',
            output: "false",
            explanation: "Characters do not match in frequency.",
          },
        ],
        starterCode: {
          python: "def is_anagram(s: str, t: str) -> bool:\n    # Write your solution here\n    pass",
          javascript: "function isAnagram(s, t) {\n  // Write your solution here\n}",
          java: "class Solution {\n    public boolean isAnagram(String s, String t) {\n        return false;\n    }\n}",
        },
        constraints: ["1 <= s.length, t.length <= 5 * 10^4", "s and t consist of lowercase English letters."],
        interviewerGuidance: "Optimal approach uses a fixed-size frequency array of length 26 in O(N) time and O(1) space.",
        expectedComplexity: {
          time: "O(N)",
          space: "O(1)",
        },
        modelUsed: "calibrated-baseline",
      };
    }

    if (input.difficulty === "Hard") {
      return {
        title: "Trapping Rain Water Capacity",
        description:
          "Given `n` non-negative integers representing an elevation map where the width of each bar is `1`, compute how much water it can trap after raining.",
        examples: [
          {
            input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]",
            output: "6",
            explanation: "The elevation map traps 6 total units of water between the peaks.",
          },
        ],
        starterCode: {
          python: "def trap_rain_water(height: list[int]) -> int:\n    # Write your solution here\n    pass",
          javascript: "function trapRainWater(height) {\n  // Write your solution here\n}",
          java: "class Solution {\n    public int trapRainWater(int[] height) {\n        return 0;\n    }\n}",
        },
        constraints: ["n == height.length", "1 <= n <= 2 * 10^4", "0 <= height[i] <= 10^5"],
        interviewerGuidance: "Two-pointer approach achieves O(N) time and O(1) auxiliary space.",
        expectedComplexity: {
          time: "O(N)",
          space: "O(1)",
        },
        modelUsed: "calibrated-baseline",
      };
    }

    return {
      title: "Concurrent Task Interval Scheduler",
      description:
        "Given a list of scheduled tasks with arrival times and durations `[start, end]`, return the maximum number of non-overlapping tasks that can be executed on a single worker thread.\n\nNotice that if a task ends at time `t`, another task can start immediately at time `t`.",
      examples: [
        {
          input: "tasks = [[1, 3], [2, 4], [3, 5]]",
          output: "2",
          explanation: "Task [1,3] and Task [3,5] can be run consecutively without overlap.",
        },
      ],
      starterCode: {
        python: "def max_scheduled_tasks(tasks: list[list[int]]) -> int:\n    # Write your solution here\n    pass",
        javascript: "function maxScheduledTasks(tasks) {\n  // Write your solution here\n}",
        java: "class Solution {\n    public int maxScheduledTasks(int[][] tasks) {\n        return 0;\n    }\n}",
      },
      constraints: ["1 <= tasks.length <= 10^5", "0 <= start < end <= 10^9"],
      interviewerGuidance: "Greedy interval scheduling sorting by earliest finish time in O(N log N).",
      expectedComplexity: {
        time: "O(N log N)",
        space: "O(1)",
      },
      modelUsed: "calibrated-baseline",
    };
  }
}
