"use server";

import { callAi, extractCleanJson } from "@/lib/ai-provider";

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
You are Atlas, a Principal Distributed Systems & Cloud Infrastructure Architect conducting a Staff/Principal System Design interview review on Codeview.

CALIBRATION & TOPOLOGY ACCURACY RULES:
- If the architecture contains 2 or fewer nodes (e.g., just client and single database): scalabilityScore MUST be < 35, resilienceScore MUST be < 30, and executiveVerdict MUST be "Critical Bottlenecks".
- If the target scale (${input.qpsTarget}) is high (>= 20k QPS) and the design lacks a Caching tier (Redis/Memcached) or Queue (Kafka/RabbitMQ), executiveVerdict MUST be "Critical Bottlenecks" (scalabilityScore < 55).
- Only award "Production Ready" (scores >= 85) if the system demonstrates high availability: redundant load balancers, horizontally scaled app tiers, read/write database replication with failover, and decoupled asynchronous workers.

Analyze the proposed architecture topology (nodes, services, databases, caches, queues, and connection edges) against the target scale (${input.qpsTarget}).

Identify:
1. Single Points of Failure (SPOF)
2. Bottlenecks (e.g., synchronous calls to SQL DB at high QPS, missing read replicas)
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

    const jsonStr = extractCleanJson(aiRes.text);
    const parsed = JSON.parse(jsonStr) as ArchitectureCriticResponse;
    return {
      ...parsed,
      modelUsed: aiRes.modelUsed,
    };
  } catch (error: any) {
    console.warn("Atlas architecture fallback activated, computing calibrated topology metrics:", error);
    const nodeCount = input.nodes?.length || 0;
    const hasCache = input.nodes.some((n) => n.type.toLowerCase().includes("cache") || n.label.toLowerCase().includes("redis"));
    const hasDb = input.nodes.some((n) => n.type.toLowerCase().includes("db") || n.type.toLowerCase().includes("database"));
    const hasQueue = input.nodes.some((n) => n.type.toLowerCase().includes("queue") || n.label.toLowerCase().includes("kafka"));

    if (nodeCount <= 2) {
      return {
        scalabilityScore: 28,
        resilienceScore: 25,
        executiveVerdict: "Critical Bottlenecks",
        singlePointsOfFailure: [
          "Monolithic topology: single database instance without replication or failover.",
          "Missing redundant application layer.",
        ],
        bottlenecks: [
          "Target scale (" + input.qpsTarget + ") will instantly saturate connection pools and compute.",
        ],
        probingQuestions: [
          {
            area: "Fault Tolerance",
            question: "If your primary database crashes, what is the recovery time objective (RTO)?",
            expectedInsight: "Primary-replica replication with automated failover via Patroni or AWS Aurora Multi-AZ.",
          },
        ],
        recommendedImprovements: [
          "Introduce a reverse-proxy Load Balancer in front of stateless application instances.",
          "Provision read replicas and an in-memory cache to absorb read spikes.",
        ],
        modelUsed: "calibrated-baseline",
      };
    }

    const isScaleReady = hasCache && hasDb && hasQueue;
    const verdict = isScaleReady ? "Production Ready" : "Acceptable Trade-offs";

    return {
      scalabilityScore: isScaleReady ? 88 : 68,
      resilienceScore: isScaleReady ? 85 : 64,
      executiveVerdict: verdict,
      singlePointsOfFailure: isScaleReady
        ? ["Verify multi-region failover for external API dependencies."]
        : ["Primary SQL Database lacks automated multi-zone failover."],
      bottlenecks: isScaleReady
        ? ["Monitor write-heavy queue back-pressure during ingestion bursts."]
        : ["Direct synchronous database writes will saturate under traffic spikes without queueing."],
      probingQuestions: [
        {
          area: "Caching",
          question: "How do you handle cache invalidation and thundering herd stampedes?",
          expectedInsight: "Mutual exclusion locks, probabilistic early expiration (XFetch), or write-through caches.",
        },
        {
          area: "Database Sharding",
          question: "What partition key guarantees even data distribution without hot partitions?",
          expectedInsight: "Consistent hashing with virtual nodes across tenant or customer ID hashes.",
        },
      ],
      recommendedImprovements: [
        "Incorporate circuit breakers (e.g., resilience4j or Envoy) around downstream dependencies.",
        "Ensure asynchronous dead-letter queues (DLQ) are configured for poison pill payloads.",
      ],
      modelUsed: "calibrated-baseline",
    };
  }
}
