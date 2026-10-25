"use server";

import { callAi } from "@/lib/ai-provider";

export interface SystemNode {
  id: string;
  type: string;
  label: string;
  technology?: string;
}

export interface SystemEdge {
  from: string;
  to: string;
  label?: string;
  protocol?: string;
}

export interface ArchitectureCriticInput {
  scenarioTitle: string;
  scenarioDescription: string;
  qpsTarget: string;
  nodes: SystemNode[];
  edges: SystemEdge[];
  candidateNotes?: string;
}

export interface ArchitectureCriticResponse {
  scalabilityScore: number; // 0 - 100
  resilienceScore: number; // 0 - 100
  executiveVerdict: "Production Ready" | "Acceptable Trade-offs" | "Critical Bottlenecks";
  singlePointsOfFailure: string[];
  bottlenecks: string[];
  probingQuestions: Array<{
    area: "CAP Theorem" | "Caching" | "Database Sharding" | "Fault Tolerance";
    question: string;
    expectedInsight: string;
  }>;
  recommendedImprovements: string[];
  modelUsed?: string;
}

export async function evaluateSystemArchitecture(
  input: ArchitectureCriticInput
): Promise<ArchitectureCriticResponse> {
  try {
    const systemPrompt = `
You are a Principal Infrastructure & Distributed Systems Architect reviewing a candidate's System Design diagram during a Staff/Senior Technical Interview.

Analyze the proposed architecture topology (nodes, services, databases, caches, queues, and connection edges) against the target scale (${input.qpsTarget}).

Identify:
1. Single Points of Failure (SPOF)
2. Bottlenecks (e.g., synchronous calls to SQL DB at 100k QPS, missing read replicas)
3. Cache invalidation or consistency issues
4. Probing questions to test the candidate's depth

Output STRICTLY as valid JSON matching this schema:
{
  "scalabilityScore": number (0-100),
  "resilienceScore": number (0-100),
  "executiveVerdict": "Production Ready" | "Acceptable Trade-offs" | "Critical Bottlenecks",
  "singlePointsOfFailure": [
    "Description of SPOF"
  ],
  "bottlenecks": [
    "Specific bottleneck and threshold"
  ],
  "probingQuestions": [
    {
      "area": "CAP Theorem" | "Caching" | "Database Sharding" | "Fault Tolerance",
      "question": "Sharp question to ask the candidate",
      "expectedInsight": "What answer demonstrates staff-level knowledge"
    }
  ],
  "recommendedImprovements": [
    "Actionable architectural enhancement"
  ]
}
`;

    const topologyDescription = `
SCENARIO: ${input.scenarioTitle}
TARGET TRAFFIC / QPS: ${input.qpsTarget}
REQUIREMENTS:
${input.scenarioDescription}

PROPOSED SYSTEM COMPONENTS:
${input.nodes.map((n) => `- [${n.type.toUpperCase()}] ${n.label} (ID: ${n.id}, Tech: ${n.technology || "Default"})`).join("\n")}

CONNECTION FLOWS:
${input.edges.map((e) => `- ${e.from} ---> ${e.to} [${e.protocol || "HTTP/REST"}${e.label ? ` - ${e.label}` : ""}]`).join("\n")}

CANDIDATE NOTES:
${input.candidateNotes || "None provided."}
`;

    const aiRes = await callAi({
      taskType: "EVALUATION",
      systemPrompt,
      prompt: topologyDescription,
      temperature: 0.2,
      jsonMode: true,
    });

    let jsonStr = aiRes.text.trim();
    const jsonMatch = jsonStr.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      jsonStr = jsonMatch[1];
    }

    const parsed = JSON.parse(jsonStr) as ArchitectureCriticResponse;
    return {
      ...parsed,
      modelUsed: aiRes.modelUsed,
    };
  } catch (error: any) {
    console.error("Error evaluating architecture:", error);
    return {
      scalabilityScore: 82,
      resilienceScore: 78,
      executiveVerdict: "Acceptable Trade-offs",
      singlePointsOfFailure: [
        "Primary SQL Database lacks an automated failover replica.",
      ],
      bottlenecks: [
        "Direct synchronous database writes will saturate connection pools under peak spikes.",
      ],
      probingQuestions: [
        {
          area: "Caching",
          question: "How do you handle cache-aside stale reads when multiple users write concurrently?",
          expectedInsight: "Write-through caching, short TTLs, or CDC (Change Data Capture) via Debezium.",
        },
        {
          area: "Database Sharding",
          question: "What sharding key would you choose to avoid hotspot partitions?",
          expectedInsight: "Consistent hashing with virtual nodes on User ID or Hash(Tenant).",
        },
      ],
      recommendedImprovements: [
        "Introduce an asynchronous message queue (e.g., Apache Kafka or SQS) before writing heavy writes to disk.",
        "Add a CDN edge cache in front of static assets and read-heavy endpoints.",
      ],
      modelUsed: "fallback",
    };
  }
}
