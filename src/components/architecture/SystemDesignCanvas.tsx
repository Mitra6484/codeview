"use client";

import { useState, useRef, useEffect } from "react";
import {
  Server,
  Database,
  Layers,
  Cpu,
  Globe,
  Radio,
  HardDrive,
  Inbox,
  Plus,
  Trash2,
  Play,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  HelpCircle,
  TrendingUp,
  Workflow,
  CheckCircle,
  X,
  Link2,
  Activity,
  AlertTriangle,
  Gauge,
  Zap,
  BarChart3,
  RefreshCw,
} from "lucide-react";
import {
  evaluateSystemArchitecture,
  ArchitectureCriticResponse,
  SystemNode,
  SystemEdge,
} from "@/actions/ai/architecture-critic";
import toast from "react-hot-toast";

export interface CanvasNode extends SystemNode {
  x: number;
  y: number;
}

export interface CanvasEdge extends SystemEdge {}

export interface SimulationReport {
  targetQps: number;
  achievedQps: number;
  successRate: number;
  p50LatencyMs: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  cacheHitRatio?: number;
  bottlenecks: {
    nodeId: string;
    nodeLabel: string;
    severity: "critical" | "warning" | "optimal";
    issue: string;
    fix: string;
  }[];
  nodeMetrics: {
    nodeId: string;
    label: string;
    technology: string;
    type: string;
    qpsHandled: number;
    cpuLoad: number;
    memoryLoad: number;
    status: "Healthy" | "Strained" | "Bottleneck";
  }[];
}

export const PROTOCOL_OPTIONS = [
  "HTTPS",
  "gRPC",
  "HTTP/2",
  "WebSocket",
  "Redis",
  "SQL",
  "Kafka",
  "TCP",
  "S3 API",
];

export const inferProtocol = (fromNode?: CanvasNode, toNode?: CanvasNode): string => {
  if (!fromNode || !toNode) return "HTTPS";
  const types = [fromNode.type, toNode.type];
  if (types.includes("cache")) return "Redis";
  if (types.includes("db")) return "SQL";
  if (types.includes("nosql")) return "SQL";
  if (types.includes("queue")) return "Kafka";
  if (types.includes("storage")) return "S3 API";
  if (types.includes("client")) return "HTTPS";
  if (types.includes("cdn") && types.includes("lb")) return "HTTPS";
  if (types.includes("gateway") || (fromNode.type === "lb" && toNode.type === "service")) return "HTTP/2";
  if (fromNode.type === "service" && toNode.type === "service") return "gRPC";
  return "HTTPS";
};

function calculateSimulation(nodes: CanvasNode[], edges: CanvasEdge[]): SimulationReport {
  const targetQps = 100000;
  const hasCdn = nodes.some((n) => n.type === "cdn");
  const hasLb = nodes.some((n) => n.type === "lb" || n.type === "gateway");
  const hasCache = nodes.some((n) => n.type === "cache");
  const hasDb = nodes.some((n) => n.type === "db" || n.type === "nosql");
  const services = nodes.filter((n) => n.type === "service");

  const bottlenecks: SimulationReport["bottlenecks"] = [];

  let achievedQps = targetQps;
  let successRate = 99.96;
  let p50LatencyMs = 12;
  let p95LatencyMs = 34;
  let p99LatencyMs = 88;
  let cacheHitRatio: number | undefined = undefined;

  if (hasDb && !hasCache) {
    achievedQps = Math.min(achievedQps, 24500);
    successRate = 73.8;
    p50LatencyMs = 185;
    p95LatencyMs = 610;
    p99LatencyMs = 1450;

    const dbNode = nodes.find((n) => n.type === "db" || n.type === "nosql");
    if (dbNode) {
      bottlenecks.push({
        nodeId: dbNode.id,
        nodeLabel: dbNode.label,
        severity: "critical",
        issue: "Database Connection Pool Starvation: 100,000 QPS direct reads caused 100% CPU lockup & query timeouts.",
        fix: "Introduce an In-Memory Cache (Redis) in front of the database to absorb 85%+ of read queries.",
      });
    }
  } else if (hasCache) {
    cacheHitRatio = 87.4;
    achievedQps = 98700;
    successRate = 99.95;
    p50LatencyMs = 11;
    p95LatencyMs = 31;
    p99LatencyMs = 82;
  }

  if (!hasCdn) {
    p50LatencyMs += 15;
    p95LatencyMs += 40;
    p99LatencyMs += 85;
    bottlenecks.push({
      nodeId: "network",
      nodeLabel: "Edge Network",
      severity: "warning",
      issue: "No Edge CDN: Static assets and cacheable dynamic responses must traverse origin infrastructure.",
      fix: "Add Cloudflare CDN or CloudFront at the perimeter to terminate SSL and serve edge cached responses.",
    });
  }

  if (!hasLb && services.length > 0) {
    bottlenecks.push({
      nodeId: services[0].id,
      nodeLabel: services[0].label,
      severity: "warning",
      issue: "Missing Load Balancer: Direct traffic to service prevents horizontal auto-scaling and health failover.",
      fix: "Place an Nginx/ALB or API Gateway between clients and microservices.",
    });
  }

  if (services.length === 0) {
    achievedQps = 0;
    successRate = 0;
    bottlenecks.push({
      nodeId: "arch",
      nodeLabel: "Compute Layer",
      severity: "critical",
      issue: "No Microservice or API compute cluster present to process business logic.",
      fix: "Add a Microservice cluster to handle incoming client traffic.",
    });
  }

  const nodeMetrics: SimulationReport["nodeMetrics"] = nodes.map((node) => {
    let qpsHandled = targetQps;
    let cpuLoad = 25;
    let memoryLoad = 35;
    let status: "Healthy" | "Strained" | "Bottleneck" = "Healthy";

    if (node.type === "client") {
      qpsHandled = targetQps;
      cpuLoad = 15;
      memoryLoad = 20;
    } else if (node.type === "cdn") {
      qpsHandled = targetQps;
      cpuLoad = 18;
      memoryLoad = 42;
    } else if (node.type === "lb" || node.type === "gateway") {
      qpsHandled = hasCdn ? 65000 : targetQps;
      cpuLoad = 32;
      memoryLoad = 30;
    } else if (node.type === "service") {
      qpsHandled = hasCdn ? 65000 : targetQps;
      cpuLoad = hasCache ? 42 : 78;
      memoryLoad = 55;
      if (!hasCache && hasDb) {
        status = "Strained";
      }
    } else if (node.type === "cache") {
      qpsHandled = 65000;
      cpuLoad = 28;
      memoryLoad = 68;
    } else if (node.type === "db" || node.type === "nosql") {
      if (hasCache) {
        qpsHandled = 12500;
        cpuLoad = 34;
        memoryLoad = 62;
      } else {
        qpsHandled = targetQps;
        cpuLoad = 100;
        memoryLoad = 96;
        status = "Bottleneck";
      }
    } else if (node.type === "queue") {
      qpsHandled = 35000;
      cpuLoad = 22;
      memoryLoad = 48;
    }

    return {
      nodeId: node.id,
      label: node.label,
      technology: node.technology || "Service",
      type: node.type,
      qpsHandled,
      cpuLoad,
      memoryLoad,
      status,
    };
  });

  return {
    targetQps,
    achievedQps,
    successRate,
    p50LatencyMs,
    p95LatencyMs,
    p99LatencyMs,
    cacheHitRatio,
    bottlenecks,
    nodeMetrics,
  };
}

const COMPONENT_PALETTE = [
  { type: "client", label: "Client App", icon: Globe, tech: "Web / Mobile", color: "from-blue-500 to-cyan-500" },
  { type: "cdn", label: "CDN Edge", icon: Radio, tech: "Cloudflare", color: "from-amber-500 to-orange-500" },
  { type: "lb", label: "Load Balancer", icon: Layers, tech: "Nginx / ALB", color: "from-indigo-500 to-violet-500" },
  { type: "gateway", label: "API Gateway", icon: Workflow, tech: "Envoy", color: "from-purple-500 to-pink-500" },
  { type: "service", label: "Microservice", icon: Cpu, tech: "Go / Node.js", color: "from-emerald-500 to-teal-500" },
  { type: "cache", label: "In-Memory Cache", icon: Server, tech: "Redis", color: "from-rose-500 to-red-500" },
  { type: "db", label: "Relational DB", icon: Database, tech: "PostgreSQL", color: "from-blue-600 to-indigo-600" },
  { type: "nosql", label: "NoSQL Store", icon: Database, tech: "Cassandra", color: "from-cyan-600 to-blue-700" },
  { type: "queue", label: "Message Queue", icon: Inbox, tech: "Apache Kafka", color: "from-amber-600 to-yellow-500" },
  { type: "storage", label: "Object Storage", icon: HardDrive, tech: "AWS S3", color: "from-emerald-600 to-teal-700" },
];

interface SystemDesignCanvasProps {
  call?: any;
}

export default function SystemDesignCanvas({ call }: SystemDesignCanvasProps = {}) {
  // Canvas State
  const [nodes, setNodes] = useState<CanvasNode[]>([
    { id: "client_1", type: "client", label: "Client Apps", technology: "iOS / Web", x: 60, y: 160 },
    { id: "cdn_1", type: "cdn", label: "Cloudflare CDN", technology: "Edge Cache", x: 240, y: 160 },
    { id: "lb_1", type: "lb", label: "Load Balancer", technology: "Nginx ALB", x: 420, y: 160 },
    { id: "service_1", type: "service", label: "Core API Service", technology: "Go Cluster", x: 600, y: 160 },
    { id: "cache_1", type: "cache", label: "Redis Cache", technology: "Cluster (LRU)", x: 780, y: 80 },
    { id: "db_1", type: "db", label: "PostgreSQL Primary", technology: "ACID Storage", x: 780, y: 240 },
  ]);

  const [edges, setEdges] = useState<CanvasEdge[]>([
    { from: "client_1", to: "cdn_1", protocol: "HTTPS" },
    { from: "cdn_1", to: "lb_1", protocol: "gRPC" },
    { from: "lb_1", to: "service_1", protocol: "HTTP/2" },
    { from: "service_1", to: "cache_1", protocol: "TCP" },
    { from: "service_1", to: "db_1", protocol: "SQL" },
  ]);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeIdx, setSelectedEdgeIdx] = useState<number | null>(null);
  const [connectSourceId, setConnectSourceId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Collaborative Sync Refs
  const isRemoteCanvasUpdateRef = useRef(false);
  const syncCanvasTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Broadcast canvas changes over call
  useEffect(() => {
    if (!call || isRemoteCanvasUpdateRef.current) return;
    if (syncCanvasTimeoutRef.current) clearTimeout(syncCanvasTimeoutRef.current);
    syncCanvasTimeoutRef.current = setTimeout(() => {
      call.sendCustomEvent({
        type: "canvas-sync",
        data: { nodes, edges },
      });
    }, 200);
  }, [nodes, edges, call]);

  // Listen for canvas sync events from other participant
  useEffect(() => {
    if (!call) return;

    const handleCanvasEvents = (event: any) => {
      if (event.type === "canvas-sync" && event.data) {
        isRemoteCanvasUpdateRef.current = true;
        if (event.data.nodes) setNodes(event.data.nodes);
        if (event.data.edges) setEdges(event.data.edges);
        setTimeout(() => {
          isRemoteCanvasUpdateRef.current = false;
        }, 150);
      }
    };

    call.on("custom", handleCanvasEvents);
    return () => {
      call.off("custom", handleCanvasEvents);
    };
  }, [call]);

  // Keyboard shortcut listener for Delete & Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedNodeId) {
          handleDeleteSelected();
        } else if (selectedEdgeIdx !== null) {
          handleDeleteEdge(selectedEdgeIdx);
        }
      } else if (e.key === "Escape") {
        setSelectedNodeId(null);
        setSelectedEdgeIdx(null);
        setConnectSourceId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedNodeId, selectedEdgeIdx]);

  // Simulation & AI Critic State
  const [isSimulating, setIsSimulating] = useState(false);
  const [isCritiquing, setIsCritiquing] = useState(false);
  const [criticResult, setCriticResult] = useState<ArchitectureCriticResponse | null>(null);
  const [simulationResult, setSimulationResult] = useState<SimulationReport | null>(null);
  const [drawerTab, setDrawerTab] = useState<"simulation" | "critic">("simulation");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const canvasRef = useRef<SVGSVGElement | null>(null);

  // Protocol changer
  const handleChangeEdgeProtocol = (idx: number, protocol: string) => {
    setEdges((prev) => prev.map((e, i) => (i === idx ? { ...e, protocol } : e)));
    toast.success(`Protocol set to ${protocol}`);
  };

  // Node Click handler
  const handleNodeClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();

    // In connection mode:
    if (connectSourceId) {
      if (connectSourceId !== id) {
        const fromNode = nodes.find((n) => n.id === connectSourceId);
        const toNode = nodes.find((n) => n.id === id);

        const exists = edges.some(
          (edge) =>
            (edge.from === connectSourceId && edge.to === id) ||
            (edge.from === id && edge.to === connectSourceId)
        );

        if (!exists) {
          const protocol = inferProtocol(fromNode, toNode);
          setEdges((prev) => [...prev, { from: connectSourceId, to: id, protocol }]);
          toast.success(`Connected ${fromNode?.label || "Node"} → ${toNode?.label || "Node"} (${protocol})`);
        } else {
          toast("Connection already exists between these components", { icon: "ℹ️" });
        }
      }
      setConnectSourceId(null);
      setSelectedNodeId(id);
      return;
    }

    // Normal selection mode:
    setSelectedNodeId(id);
    setSelectedEdgeIdx(null);
  };

  // Node MouseDown handler for dragging
  const handleMouseDownNode = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (connectSourceId) {
      // Don't drag while linking
      return;
    }

    const node = nodes.find((n) => n.id === id);
    if (!node) return;

    setSelectedNodeId(id);
    setSelectedEdgeIdx(null);
    setDraggingId(id);
    setDragOffset({
      x: e.clientX - node.x,
      y: e.clientY - node.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingId || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const newX = Math.max(20, Math.min(rect.width - 170, e.clientX - dragOffset.x));
    const newY = Math.max(20, Math.min(rect.height - 100, e.clientY - dragOffset.y));

    setNodes((prev) =>
      prev.map((n) => (n.id === draggingId ? { ...n, x: newX, y: newY } : n))
    );
  };

  const handleMouseUp = () => {
    setDraggingId(null);
  };

  // Add Component to Canvas
  const handleAddComponent = (item: typeof COMPONENT_PALETTE[number]) => {
    const id = `${item.type}_${Date.now() % 1000}`;
    const newNode: CanvasNode = {
      id,
      type: item.type,
      label: item.label,
      technology: item.tech,
      x: 350 + Math.random() * 60,
      y: 140 + Math.random() * 60,
    };
    setNodes((prev) => [...prev, newNode]);
    setSelectedNodeId(id);
    setSelectedEdgeIdx(null);
    toast.success(`Added ${item.label}`);
  };

  // Delete Component
  const handleDeleteSelected = () => {
    if (!selectedNodeId) return;
    const target = nodes.find((n) => n.id === selectedNodeId);
    setNodes((prev) => prev.filter((n) => n.id !== selectedNodeId));
    setEdges((prev) => prev.filter((e) => e.from !== selectedNodeId && e.to !== selectedNodeId));
    setSelectedNodeId(null);
    setConnectSourceId(null);
    toast.success(`Removed ${target?.label || "component"}`);
  };

  // Delete Edge
  const handleDeleteEdge = (idx: number) => {
    setEdges((prev) => prev.filter((_, i) => i !== idx));
    setSelectedEdgeIdx(null);
    toast.success("Connection deleted");
  };

  // Reset Canvas to Template
  const handleReset = () => {
    setNodes([
      { id: "client_1", type: "client", label: "Client Apps", technology: "iOS / Web", x: 60, y: 160 },
      { id: "cdn_1", type: "cdn", label: "Cloudflare CDN", technology: "Edge Cache", x: 240, y: 160 },
      { id: "lb_1", type: "lb", label: "Load Balancer", technology: "Nginx ALB", x: 420, y: 160 },
      { id: "service_1", type: "service", label: "Core API Service", technology: "Go Cluster", x: 600, y: 160 },
      { id: "cache_1", type: "cache", label: "Redis Cache", technology: "Cluster (LRU)", x: 780, y: 80 },
      { id: "db_1", type: "db", label: "PostgreSQL Primary", technology: "ACID Storage", x: 780, y: 240 },
    ]);
    setEdges([
      { from: "client_1", to: "cdn_1", protocol: "HTTPS" },
      { from: "cdn_1", to: "lb_1", protocol: "gRPC" },
      { from: "lb_1", to: "service_1", protocol: "HTTP/2" },
      { from: "service_1", to: "cache_1", protocol: "TCP" },
      { from: "service_1", to: "db_1", protocol: "SQL" },
    ]);
    setSelectedNodeId(null);
    setSelectedEdgeIdx(null);
    setConnectSourceId(null);
    setCriticResult(null);
    setSimulationResult(null);
    toast.success("Canvas reset to baseline architecture");
  };

  // Trigger Traffic Simulation
  const handleSimulateTraffic = () => {
    setIsSimulating(true);
    setDrawerTab("simulation");
    setIsDrawerOpen(true);
    toast("Simulating 100,000 QPS load burst across architecture...", { icon: "⚡" });
    const report = calculateSimulation(nodes, edges);
    setSimulationResult(report);
    setTimeout(() => {
      setIsSimulating(false);
      toast.success(`Traffic simulation complete: ${report.achievedQps.toLocaleString()} QPS processed!`);
    }, 4000);
  };

  // Trigger AI Architecture Critique
  const handleCritiqueArchitecture = async () => {
    setIsCritiquing(true);
    setDrawerTab("critic");
    setIsDrawerOpen(true);
    try {
      const res = await evaluateSystemArchitecture({
        scenarioTitle: "High-Throughput Web Platform",
        scenarioDescription: "Design a fault-tolerant system supporting 100,000 QPS with sub-50ms latency.",
        qpsTarget: "100,000 QPS",
        nodes: nodes.map(({ id, type, label, technology }) => ({ id, type, label, technology })),
        edges,
      });
      setCriticResult(res);
      toast.success("Atlas architecture audit completed!");
    } catch (e) {
      console.error("AI Critique failed:", e);
      toast.error("Failed to critique architecture");
    } finally {
      setIsCritiquing(false);
    }
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  const connectSourceNode = nodes.find((n) => n.id === connectSourceId);

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden glass-canvas select-none">
      {/* TOP TOOLBAR */}
      <div className="glass-nav px-4 py-2.5 flex items-center justify-between border-b border-white/10 z-20">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="glass-pill px-2.5 py-1 rounded-full text-xs font-semibold text-indigo-300">
              Interactive Canvas
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">
              Target: <strong className="text-white">100,000 QPS</strong>
            </span>
          </div>

          <div className="h-4 w-px bg-white/10 mx-1" />

          {/* Connect Source Active Mode */}
          {connectSourceId ? (
            <div className="flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 rounded-xl text-xs text-emerald-300 animate-pulse">
              <Workflow className="w-3.5 h-3.5" />
              <span>Linking from: <strong>{connectSourceNode?.label}</strong> (click target node)</span>
              <button
                onClick={() => setConnectSourceId(null)}
                className="ml-1 p-0.5 rounded-full hover:bg-emerald-500/30 text-emerald-200 cursor-pointer"
                title="Cancel Connection"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                if (selectedNodeId) {
                  setConnectSourceId(selectedNodeId);
                  toast("Click any target component to connect", { icon: "🔗" });
                } else if (nodes.length > 0) {
                  setConnectSourceId(nodes[0].id);
                  toast(`Connecting from ${nodes[0].label}. Click target node.`, { icon: "🔗" });
                }
              }}
              className="glass-btn-secondary px-3 py-1 rounded-xl text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer transition-all"
              title="Click source node, then click target node to connect"
            >
              <Workflow className="w-3.5 h-3.5 text-indigo-400" />
              <span>Connect Nodes</span>
            </button>
          )}

          {/* Node Selected Controls */}
          {selectedNode && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-indigo-300 px-2 py-0.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                {selectedNode.label}
              </span>
              <button
                onClick={handleDeleteSelected}
                className="glass-btn-secondary bg-rose-500/15 hover:bg-rose-500/25 border-rose-500/30 text-rose-300 px-2.5 py-1 rounded-xl text-xs flex items-center gap-1 transition-colors cursor-pointer"
                title="Delete Selected Component (or press Delete key)"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          )}

          {/* Edge Selected Controls with Protocol Picker */}
          {selectedEdgeIdx !== null && edges[selectedEdgeIdx] && (
            <div className="flex items-center gap-1.5 bg-slate-900/90 border border-white/10 px-2.5 py-1 rounded-xl">
              <span className="text-[10px] font-mono text-slate-400 font-semibold uppercase">Protocol:</span>
              <div className="flex items-center gap-1 overflow-x-auto max-w-[280px] sm:max-w-none">
                {PROTOCOL_OPTIONS.map((proto) => (
                  <button
                    key={proto}
                    onClick={() => handleChangeEdgeProtocol(selectedEdgeIdx, proto)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-medium transition-all cursor-pointer ${
                      edges[selectedEdgeIdx].protocol === proto
                        ? "bg-indigo-600 text-white font-bold shadow-[0_0_8px_rgba(99,102,241,0.5)] border border-indigo-400/50"
                        : "text-slate-400 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {proto}
                  </button>
                ))}
              </div>
              <div className="h-3.5 w-px bg-white/10 mx-1" />
              <button
                onClick={() => handleDeleteEdge(selectedEdgeIdx)}
                className="text-rose-400 hover:text-rose-300 text-[10px] font-mono flex items-center gap-1 cursor-pointer"
                title="Delete Connection"
              >
                <Trash2 className="w-3 h-3" />
                <span>Delete</span>
              </button>
            </div>
          )}

          <button
            onClick={handleReset}
            className="p-1.5 rounded-xl glass-btn-secondary text-slate-400 hover:text-white text-xs cursor-pointer ml-1"
            title="Reset Architecture to Baseline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2.5">
          {simulationResult && (
            <button
              onClick={() => {
                setDrawerTab("simulation");
                setIsDrawerOpen(true);
              }}
              className="glass-btn-secondary px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-300 border-emerald-500/30 flex items-center gap-1.5 cursor-pointer"
            >
              <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Sim Report</span>
              <span className="font-mono text-[10px] text-emerald-400">({simulationResult.achievedQps.toLocaleString()} QPS)</span>
            </button>
          )}

          <button
            onClick={handleSimulateTraffic}
            disabled={isSimulating}
            className={`glass-btn-secondary px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
              isSimulating ? "text-emerald-400 border-emerald-500/40" : "text-slate-300"
            }`}
          >
            <Play className={`w-3.5 h-3.5 ${isSimulating ? "animate-spin text-emerald-400" : ""}`} />
            <span>{isSimulating ? "Simulating 100k QPS..." : "Simulate Traffic"}</span>
          </button>

          <button
            onClick={handleCritiqueArchitecture}
            disabled={isCritiquing}
            className="glass-btn-primary px-4 py-1.5 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-500/25"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isCritiquing ? "animate-spin" : ""}`} />
            <span>{isCritiquing ? "AI Reviewing..." : "Critique Architecture"}</span>
          </button>
        </div>
      </div>

      {/* WORKSPACE BODY: Palette + Canvas + AI Drawer */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* LEFT PALETTE (Component Toolbox) */}
        <div className="w-56 glass-nav border-r border-white/10 p-3.5 flex flex-col gap-3 overflow-y-auto z-10 shrink-0">
          <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs font-semibold text-slate-300">
            <span>Component Palette</span>
            <span className="text-[10px] font-mono text-slate-500">10 Blocks</span>
          </div>

          <div className="space-y-1.5">
            {COMPONENT_PALETTE.map((comp) => {
              const Icon = comp.icon;
              return (
                <button
                  key={comp.type}
                  onClick={() => handleAddComponent(comp)}
                  className="w-full p-2.5 rounded-xl glass-card border border-white/5 hover:border-white/20 flex items-center gap-2.5 text-left text-xs transition-all group cursor-pointer"
                >
                  <div
                    className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${comp.color} flex items-center justify-center text-white shadow-sm shrink-0`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="truncate">
                    <span className="font-semibold text-white block group-hover:text-indigo-200 truncate">
                      {comp.label}
                    </span>
                    <span className="text-[10px] text-slate-400 block truncate">{comp.tech}</span>
                  </div>
                  <Plus className="w-3 h-3 text-slate-500 group-hover:text-white ml-auto shrink-0" />
                </button>
              );
            })}
          </div>
        </div>

        {/* SVG INTERACTIVE CANVAS */}
        <div
          className="flex-1 relative overflow-hidden bg-slate-950/80 cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onClick={() => {
            setSelectedNodeId(null);
            setSelectedEdgeIdx(null);
            setConnectSourceId(null);
          }}
        >
          {/* Ambient Canvas Grid Dots */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(255, 255, 255, 0.4) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          {/* Connection Mode Helper Notification Banner */}
          {connectSourceId && (
            <div className="absolute top-4 inset-x-0 mx-auto w-max z-30 px-4 py-2 rounded-2xl glass-card border border-emerald-500/40 bg-slate-950/90 text-xs font-semibold text-emerald-300 shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-top-2">
              <Workflow className="w-4 h-4 animate-pulse text-emerald-400" />
              <span>Connecting from <strong>{connectSourceNode?.label}</strong>. Click any target component to connect.</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setConnectSourceId(null);
                }}
                className="px-2 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] ml-1 cursor-pointer"
              >
                Cancel (Esc)
              </button>
            </div>
          )}

          {/* SVG Connection Lines */}
          <svg ref={canvasRef} className="w-full h-full absolute inset-0 pointer-events-none">
            <defs>
              <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="edgeSelectedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="1" />
                <stop offset="100%" stopColor="#fbbf24" stopOpacity="1" />
              </linearGradient>
              {/* Particle Glow Filter */}
              <filter id="glowParticle" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Connection Lines */}
            {edges.map((edge, idx) => {
              const fromNode = nodes.find((n) => n.id === edge.from);
              const toNode = nodes.find((n) => n.id === edge.to);
              if (!fromNode || !toNode) return null;

              const isEdgeSelected = selectedEdgeIdx === idx;
              const x1 = fromNode.x + 80;
              const y1 = fromNode.y + 40;
              const x2 = toNode.x + 80;
              const y2 = toNode.y + 40;
              const midX = (x1 + x2) / 2;
              const midY = (y1 + y2) / 2;

              return (
                <g
                  key={idx}
                  className="pointer-events-auto cursor-pointer group"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedEdgeIdx(idx);
                    setSelectedNodeId(null);
                    setConnectSourceId(null);
                  }}
                >
                  {/* Invisible wide hit target for effortless clicking */}
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="transparent"
                    strokeWidth={20}
                  />

                  {/* Visible rendered line with flowing surge animation during simulation */}
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={isEdgeSelected ? "url(#edgeSelectedGradient)" : isSimulating ? "#38bdf8" : "url(#edgeGradient)"}
                    strokeWidth={isEdgeSelected ? 4 : isSimulating ? 3 : 2}
                    strokeDasharray={isSimulating ? "6 6" : "none"}
                    className={isSimulating ? "sim-traffic-flowing" : ""}
                  />
                  <circle
                    cx={x2}
                    cy={y2}
                    r={isEdgeSelected ? 5 : 4}
                    fill={isEdgeSelected ? "#f59e0b" : "#10b981"}
                  />

                  {/* Animated Visual Traffic Packets Darting Along the Edge */}
                  {isSimulating && (
                    <>
                      <circle r={4.5} fill="#38bdf8" filter="url(#glowParticle)">
                        <animateMotion
                          path={`M ${x1} ${y1} L ${x2} ${y2}`}
                          dur="1.2s"
                          repeatCount="indefinite"
                        />
                      </circle>
                      <circle r={3} fill="#c084fc" filter="url(#glowParticle)">
                        <animateMotion
                          path={`M ${x1} ${y1} L ${x2} ${y2}`}
                          dur="1.2s"
                          begin="0.6s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    </>
                  )}

                  {/* Protocol Badge on Edge (Clickable to select and change) */}
                  <g
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedEdgeIdx(idx);
                      setSelectedNodeId(null);
                    }}
                  >
                    <rect
                      x={midX - 30}
                      y={midY - 10}
                      width={60}
                      height={20}
                      rx={6}
                      fill={isEdgeSelected ? "#4338ca" : "#0f172a"}
                      stroke={isEdgeSelected ? "#818cf8" : "rgba(255,255,255,0.18)"}
                      strokeWidth={1}
                    />
                    <text
                      x={midX}
                      y={midY + 1}
                      fill={isEdgeSelected ? "#ffffff" : "#cbd5e1"}
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {edge.protocol || "Link"}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>

          {/* Interactive HTML Node Elements */}
          {nodes.map((node) => {
            const isSelected = selectedNodeId === node.id;
            const isConnecting = connectSourceId === node.id;
            const compDef = COMPONENT_PALETTE.find((c) => c.type === node.type);
            const CompIcon = compDef?.icon || Server;
            const isDbBottleneck = node.type === "db" && !nodes.some((n) => n.type === "cache");

            return (
              <div
                key={node.id}
                onMouseDown={(e) => handleMouseDownNode(e, node.id)}
                onClick={(e) => handleNodeClick(e, node.id)}
                style={{
                  left: `${node.x}px`,
                  top: `${node.y}px`,
                  position: "absolute",
                }}
                className={`w-40 p-3 rounded-2xl glass-card cursor-grab active:cursor-grabbing transition-all select-none ${
                  isConnecting
                    ? "ring-2 ring-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.5)] scale-102"
                    : isSelected
                    ? "ring-2 ring-indigo-400 shadow-[0_0_25px_rgba(99,102,241,0.5)] scale-102 bg-white/[0.08]"
                    : connectSourceId
                    ? "hover:ring-2 hover:ring-emerald-400/70 hover:scale-102"
                    : "hover:border-white/20"
                }`}
              >
                {/* FLOATING ACTION PILL ON SELECTED NODE */}
                {isSelected && !connectSourceId && (
                  <div
                    className="absolute -top-9 left-1/2 -translate-x-1/2 flex items-center gap-1.5 p-1 rounded-xl glass-nav border border-white/20 shadow-2xl backdrop-blur-xl z-30"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setConnectSourceId(node.id);
                        toast("Click any target component to connect", { icon: "🔗" });
                      }}
                      className="px-2 py-0.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 text-[10px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                      title="Connect to another node"
                    >
                      <Workflow className="w-3 h-3" />
                      <span>Connect</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSelected();
                      }}
                      className="p-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-[10px] cursor-pointer transition-colors"
                      title="Delete component"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {/* Target Node Connection Hint */}
                {connectSourceId && connectSourceId !== node.id && (
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[9px] font-semibold tracking-wider font-mono whitespace-nowrap animate-bounce pointer-events-none">
                    Click to Link
                  </div>
                )}

                {/* Real-Time Live Telemetry HUD during Simulation */}
                {isSimulating && (
                  <div
                    className={`absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-tight whitespace-nowrap shadow-xl flex items-center gap-1 z-30 pointer-events-none ${
                      isDbBottleneck
                        ? "bg-rose-500/30 border border-rose-400 text-rose-200 animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.5)]"
                        : "bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)] animate-pulse"
                    }`}
                  >
                    <Activity className="w-2.5 h-2.5" />
                    <span>
                      {node.type === "client" && "⚡ 100k req/s"}
                      {node.type === "cdn" && "⚡ 98k QPS (Edge 88%)"}
                      {(node.type === "lb" || node.type === "gateway") && "⚡ 65k QPS balanced"}
                      {node.type === "service" && "⚡ 65k QPS (11ms)"}
                      {node.type === "cache" && "⚡ 65k QPS (Hit: 87%)"}
                      {node.type === "db" && (isDbBottleneck ? "🔥 100% CPU OVERLOAD" : "⚡ 12.5k QPS (Healthy)")}
                      {node.type === "queue" && "⚡ 35k msg/s"}
                      {node.type === "storage" && "⚡ 15k ops/s"}
                      {node.type === "nosql" && "⚡ 45k ops/s"}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-6 h-6 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shrink-0">
                    <CompIcon className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-bold text-xs text-white truncate">{node.label}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span className="truncate">{node.technology || "Service"}</span>
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ml-1 ${isDbBottleneck && isSimulating ? "bg-rose-400 animate-ping" : "bg-emerald-400"}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT DRAWER: SIMULATION REPORT & AI CRITIC */}
        {isDrawerOpen && (
          <div className="w-full sm:w-[410px] glass-nav border-l border-white/10 p-4 overflow-y-auto space-y-4 z-20 flex flex-col justify-between shadow-2xl backdrop-blur-2xl bg-slate-950/95">
            <div>
              {/* DRAWER TOP TABS */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10">
                  <button
                    onClick={() => setDrawerTab("simulation")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      drawerTab === "simulation"
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/40"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <BarChart3 className="w-3.5 h-3.5 text-indigo-300" />
                    <span>Traffic Sim</span>
                  </button>
                  <button
                    onClick={() => setDrawerTab("critic")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      drawerTab === "critic"
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/40"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Atlas AI Audit</span>
                  </button>
                </div>

                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-white text-xs cursor-pointer"
                  title="Close Drawer"
                >
                  ✕
                </button>
              </div>

              {/* TAB 1: TRAFFIC SIMULATION REPORT */}
              {drawerTab === "simulation" && (
                <div className="space-y-4 pt-3 text-xs leading-relaxed">
                  {simulationResult ? (
                    <>
                      {/* Top Metrics Cards */}
                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="p-3 rounded-2xl glass-card border border-white/10 bg-slate-900/60">
                          <span className="text-[10px] text-slate-400 block font-medium">Achieved Throughput</span>
                          <div className="flex items-baseline gap-1 mt-0.5">
                            <span className={`text-lg font-extrabold font-mono ${simulationResult.achievedQps < 50000 ? "text-rose-400" : "text-emerald-400"}`}>
                              {simulationResult.achievedQps.toLocaleString()}
                            </span>
                            <span className="text-[10px] text-slate-400">/ 100k QPS</span>
                          </div>
                        </div>

                        <div className="p-3 rounded-2xl glass-card border border-white/10 bg-slate-900/60">
                          <span className="text-[10px] text-slate-400 block font-medium">Success Rate</span>
                          <span className={`text-lg font-extrabold font-mono mt-0.5 block ${simulationResult.successRate < 90 ? "text-rose-400" : "text-emerald-400"}`}>
                            {simulationResult.successRate}%
                          </span>
                        </div>

                        <div className="p-3 rounded-2xl glass-card border border-white/10 bg-slate-900/60">
                          <span className="text-[10px] text-slate-400 block font-medium">p95 Latency</span>
                          <span className={`text-lg font-extrabold font-mono mt-0.5 block ${simulationResult.p95LatencyMs > 100 ? "text-rose-400" : "text-indigo-400"}`}>
                            {simulationResult.p95LatencyMs} ms
                          </span>
                        </div>

                        <div className="p-3 rounded-2xl glass-card border border-white/10 bg-slate-900/60">
                          <span className="text-[10px] text-slate-400 block font-medium">p99 Latency</span>
                          <span className={`text-lg font-extrabold font-mono mt-0.5 block ${simulationResult.p99LatencyMs > 300 ? "text-rose-400" : "text-amber-400"}`}>
                            {simulationResult.p99LatencyMs} ms
                          </span>
                        </div>
                      </div>

                      {/* Cache Hit Banner if available */}
                      {simulationResult.cacheHitRatio !== undefined && (
                        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between text-xs font-semibold text-emerald-300">
                          <span>⚡ In-Memory Cache Hit Ratio</span>
                          <span className="font-mono text-emerald-400 font-bold">{simulationResult.cacheHitRatio}%</span>
                        </div>
                      )}

                      {/* Bottleneck Alerts */}
                      {simulationResult.bottlenecks.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                            Identified Bottlenecks ({simulationResult.bottlenecks.length}):
                          </span>
                          {simulationResult.bottlenecks.map((b, i) => (
                            <div
                              key={i}
                              className={`p-3 rounded-xl border text-xs space-y-1 ${
                                b.severity === "critical"
                                  ? "bg-rose-500/10 border-rose-500/30 text-rose-300"
                                  : "bg-amber-500/10 border-amber-500/30 text-amber-300"
                              }`}
                            >
                              <div className="flex items-center gap-1.5 font-bold">
                                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                                <span>{b.nodeLabel} ({b.severity.toUpperCase()})</span>
                              </div>
                              <p className="text-[11px] text-slate-300 leading-relaxed">{b.issue}</p>
                              <p className="text-[10px] text-emerald-300 font-semibold pt-1">
                                💡 Recommended Fix: {b.fix}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Component Load Breakdown Table */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                          Component Load Breakdown:
                        </span>
                        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                          {simulationResult.nodeMetrics.map((nm) => (
                            <div
                              key={nm.nodeId}
                              className="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-[11px]"
                            >
                              <div>
                                <span className="font-semibold text-white block">{nm.label}</span>
                                <span className="text-[10px] font-mono text-slate-400">{nm.qpsHandled.toLocaleString()} QPS</span>
                              </div>
                              <div className="text-right">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold ${
                                    nm.status === "Healthy"
                                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                      : nm.status === "Strained"
                                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                      : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                                  }`}
                                >
                                  {nm.cpuLoad}% CPU ({nm.status})
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="pt-2 flex items-center gap-2">
                        <button
                          onClick={handleSimulateTraffic}
                          disabled={isSimulating}
                          className="flex-1 glass-btn-secondary py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer text-slate-200"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? "animate-spin" : ""}`} />
                          <span>Re-Run Simulation</span>
                        </button>
                        <button
                          onClick={handleCritiqueArchitecture}
                          disabled={isCritiquing}
                          className="flex-1 glass-btn-primary py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer text-white"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          <span>Run AI Audit</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="py-12 text-center text-slate-400 space-y-3">
                      <BarChart3 className="w-8 h-8 text-indigo-400 mx-auto opacity-60" />
                      <p className="text-xs">No simulation data yet.</p>
                      <button
                        onClick={handleSimulateTraffic}
                        className="glass-btn-primary px-4 py-2 rounded-xl text-xs font-semibold text-white cursor-pointer"
                      >
                        Simulate 100k QPS Load
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: ATLAS AI CRITIC */}
              {drawerTab === "critic" && (
                <div>
                  {isCritiquing ? (
                    <div className="py-12 flex flex-col items-center justify-center space-y-3 text-center">
                      <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                      <p className="text-xs text-slate-400">Atlas is auditing partition tolerance & 100k QPS bottlenecks...</p>
                    </div>
                  ) : criticResult ? (
                    <div className="space-y-4 pt-3 text-xs leading-relaxed">
                      {/* Scores Grid */}
                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="p-3 rounded-2xl glass-card border border-white/10 bg-slate-900/60">
                          <span className="text-[10px] text-slate-400 block font-medium">Scalability Score</span>
                          <span className="text-xl font-extrabold text-indigo-400">{criticResult.scalabilityScore} / 100</span>
                        </div>
                        <div className="p-3 rounded-2xl glass-card border border-white/10 bg-slate-900/60">
                          <span className="text-[10px] text-slate-400 block font-medium">Resilience Score</span>
                          <span className="text-xl font-extrabold text-emerald-400">{criticResult.resilienceScore} / 100</span>
                        </div>
                      </div>

                      {/* Executive Verdict Banner */}
                      <div
                        className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between ${
                          criticResult.executiveVerdict === "Production Ready"
                            ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                            : criticResult.executiveVerdict === "Acceptable Trade-offs"
                            ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                            : "bg-rose-500/15 text-rose-300 border-rose-500/30"
                        }`}
                      >
                        <span>Verdict: {criticResult.executiveVerdict}</span>
                        <span className="text-[10px] font-mono opacity-80">100k QPS Test</span>
                      </div>

                      {/* SPOFs (Single Point of Failure) */}
                      {criticResult.singlePointsOfFailure?.length > 0 && (
                        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-1">
                          <span className="text-rose-400 font-semibold flex items-center gap-1">
                            <ShieldAlert className="w-3.5 h-3.5" /> Single Points of Failure
                          </span>
                          <ul className="list-disc pl-4 space-y-0.5 text-slate-300 text-[11px]">
                            {criticResult.singlePointsOfFailure.map((spof: string, i: number) => (
                              <li key={i}>{spof}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Bottlenecks */}
                      {criticResult.bottlenecks?.length > 0 && (
                        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                          <span className="text-amber-400 font-semibold flex items-center gap-1">
                            <TrendingUp className="w-3.5 h-3.5" /> High QPS Bottlenecks
                          </span>
                          <ul className="list-disc pl-4 space-y-0.5 text-slate-300 text-[11px]">
                            {criticResult.bottlenecks.map((b: string, i: number) => (
                              <li key={i}>{b}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Probing Questions */}
                      {criticResult.probingQuestions?.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          <span className="text-slate-400 uppercase font-mono text-[10px] block font-semibold">
                            Interviewer Probing Questions:
                          </span>
                          {criticResult.probingQuestions.map((q, i) => (
                            <div key={i} className="p-2.5 rounded-xl glass-surface border border-white/5 space-y-1">
                              <div className="flex items-center justify-between text-[10px] text-indigo-400 font-mono font-semibold">
                                <span>{q.area}</span>
                              </div>
                              <p className="text-[11px] text-slate-200 font-medium">"{q.question}"</p>
                              <p className="text-[10px] text-slate-400 italic">Target: {q.expectedInsight}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Recommended Changes */}
                      {criticResult.recommendedImprovements?.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          <span className="text-slate-400 uppercase font-mono text-[10px] block font-semibold">
                            Atlas Recommendations:
                          </span>
                          <ul className="list-disc pl-4 space-y-1 text-slate-300 text-[11px]">
                            {criticResult.recommendedImprovements.map((rec: string, i: number) => (
                              <li key={i}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="py-12 text-center text-slate-500 text-xs space-y-2">
                      <p>Click "Critique Architecture" above to run Atlas AI evaluation on this topology.</p>
                      <button
                        onClick={handleCritiqueArchitecture}
                        className="glass-btn-primary px-4 py-2 rounded-xl text-xs font-semibold text-white cursor-pointer"
                      >
                        Run Atlas AI Audit
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-white/10 text-[10px] text-slate-500 font-mono text-center">
              Atlas Agent • Free OpenRouter Llama 3.3 Engine
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
