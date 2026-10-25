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
} from "lucide-react";
import {
  evaluateSystemArchitecture,
  ArchitectureCriticResponse,
  SystemNode,
  SystemEdge,
} from "@/actions/ai/architecture-critic";

export interface CanvasNode extends SystemNode {
  x: number;
  y: number;
}

export interface CanvasEdge extends SystemEdge {}

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

export default function SystemDesignCanvas() {
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
  const [connectSourceId, setConnectSourceId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Simulation & AI Critic State
  const [isSimulating, setIsSimulating] = useState(false);
  const [isCritiquing, setIsCritiquing] = useState(false);
  const [criticResult, setCriticResult] = useState<ArchitectureCriticResponse | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const canvasRef = useRef<SVGSVGElement | null>(null);

  // Dragging logic
  const handleMouseDownNode = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (connectSourceId) {
      if (connectSourceId !== id) {
        // Create connection edge
        setEdges((prev) => [...prev, { from: connectSourceId, to: id, protocol: "HTTP" }]);
      }
      setConnectSourceId(null);
      return;
    }

    const node = nodes.find((n) => n.id === id);
    if (!node) return;

    setSelectedNodeId(id);
    setDraggingId(id);
    setDragOffset({
      x: e.clientX - node.x,
      y: e.clientY - node.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingId || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const newX = Math.max(20, Math.min(rect.width - 160, e.clientX - dragOffset.x));
    const newY = Math.max(20, Math.min(rect.height - 90, e.clientY - dragOffset.y));

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
  };

  // Delete Component
  const handleDeleteSelected = () => {
    if (!selectedNodeId) return;
    setNodes((prev) => prev.filter((n) => n.id !== selectedNodeId));
    setEdges((prev) => prev.filter((e) => e.from !== selectedNodeId && e.to !== selectedNodeId));
    setSelectedNodeId(null);
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
    setConnectSourceId(null);
    setCriticResult(null);
  };

  // Trigger Traffic Simulation
  const handleSimulateTraffic = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 4000);
  };

  // Trigger AI Architecture Critique
  const handleCritiqueArchitecture = async () => {
    setIsCritiquing(true);
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
    } catch (e) {
      console.error("AI Critique failed:", e);
    } finally {
      setIsCritiquing(false);
    }
  };

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

          {/* Quick Action buttons */}
          <button
            onClick={() => setConnectSourceId(selectedNodeId || nodes[0]?.id || null)}
            className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
              connectSourceId
                ? "glass-btn-primary bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                : "glass-btn-secondary text-slate-300 hover:text-white"
            }`}
            title="Click source node, then click target node to connect"
          >
            <Workflow className="w-3.5 h-3.5" />
            <span>{connectSourceId ? "Select Target..." : "Connect Nodes"}</span>
          </button>

          {selectedNodeId && (
            <button
              onClick={handleDeleteSelected}
              className="p-1.5 rounded-xl hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 text-xs flex items-center gap-1 transition-colors cursor-pointer"
              title="Delete Selected Component"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={handleReset}
            className="p-1.5 rounded-xl glass-btn-secondary text-slate-400 hover:text-white text-xs cursor-pointer"
            title="Reset Architecture"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2.5">
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
        <div className="w-56 glass-nav border-r border-white/10 p-3 overflow-y-auto space-y-2 z-10 hidden md:block">
          <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-2 font-semibold">
            System Blocks
          </p>

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

          <svg ref={canvasRef} className="w-full h-full absolute inset-0 pointer-events-none">
            <defs>
              <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Connection Lines */}
            {edges.map((edge, idx) => {
              const fromNode = nodes.find((n) => n.id === edge.from);
              const toNode = nodes.find((n) => n.id === edge.to);
              if (!fromNode || !toNode) return null;

              const x1 = fromNode.x + 75;
              const y1 = fromNode.y + 35;
              const x2 = toNode.x + 75;
              const y2 = toNode.y + 35;
              const midX = (x1 + x2) / 2;
              const midY = (y1 + y2) / 2;

              return (
                <g key={idx}>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="url(#edgeGradient)"
                    strokeWidth={isSimulating ? 3 : 2}
                    strokeDasharray={isSimulating ? "4 4" : "none"}
                    className={isSimulating ? "animate-pulse" : ""}
                  />
                  <circle cx={x2} cy={y2} r={4} fill="#10b981" />
                  {edge.protocol && (
                    <text
                      x={midX}
                      y={midY - 8}
                      fill="#94a3b8"
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="middle"
                      className="select-none bg-slate-900"
                    >
                      {edge.protocol}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Interactive HTML Node Elements */}
          {nodes.map((node) => {
            const isSelected = selectedNodeId === node.id;
            const isConnecting = connectSourceId === node.id;

            return (
              <div
                key={node.id}
                onMouseDown={(e) => handleMouseDownNode(e, node.id)}
                style={{
                  left: `${node.x}px`,
                  top: `${node.y}px`,
                  position: "absolute",
                }}
                className={`w-36 p-2.5 rounded-2xl glass-card cursor-grab active:cursor-grabbing transition-shadow ${
                  isConnecting
                    ? "ring-2 ring-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                    : isSelected
                    ? "ring-2 ring-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.4)]"
                    : "hover:border-white/20"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
                    <Server className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-bold text-[11px] text-white truncate">{node.label}</span>
                </div>
                <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono">
                  <span>{node.technology || "Service"}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT AI CRITIC DRAWER */}
        {isDrawerOpen && (
          <div className="w-full sm:w-96 glass-nav border-l border-white/10 p-4 overflow-y-auto space-y-4 z-20 flex flex-col justify-between shadow-2xl backdrop-blur-2xl bg-slate-950/90">
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">AI Architecture Review</h3>
                    <p className="text-[10px] text-slate-400">Evaluated at 100k QPS Target</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              </div>

              {isCritiquing ? (
                <div className="py-20 text-center space-y-2">
                  <Sparkles className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
                  <p className="text-xs text-slate-300 font-semibold">Analyzing Distributed Topology...</p>
                  <p className="text-[10px] text-slate-500">Evaluating SPOF, replication, and caching limits.</p>
                </div>
              ) : criticResult ? (
                <div className="space-y-4 mt-3 text-xs">
                  {/* SCORES */}
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/5">
                      <span className="text-[10px] text-slate-400 block">Scalability Score</span>
                      <span className="text-base font-bold text-indigo-400">
                        {criticResult.scalabilityScore}/100
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/5">
                      <span className="text-[10px] text-slate-400 block">Resilience Score</span>
                      <span className="text-base font-bold text-emerald-400">
                        {criticResult.resilienceScore}/100
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-semibold flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Verdict: {criticResult.executiveVerdict}</span>
                  </div>

                  {/* SPOF WARNINGS */}
                  {criticResult.singlePointsOfFailure?.length > 0 && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-1">
                      <span className="text-rose-400 font-bold block flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5" /> Single Point of Failure
                      </span>
                      {criticResult.singlePointsOfFailure.map((s, idx) => (
                        <p key={idx} className="text-[11px] text-slate-300">{s}</p>
                      ))}
                    </div>
                  )}

                  {/* PROBING QUESTIONS */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-300 block">
                      Staff-Level Probing Questions:
                    </span>
                    {criticResult.probingQuestions?.map((pq, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl glass-card border border-white/5 space-y-1">
                        <span className="px-1.5 py-0.5 rounded text-[9px] bg-indigo-500/20 text-indigo-300 font-mono">
                          {pq.area}
                        </span>
                        <p className="text-white font-medium text-[11px]">"{pq.question}"</p>
                        <p className="text-[10px] text-slate-400">{pq.expectedInsight}</p>
                      </div>
                    ))}
                  </div>

                  {/* IMPROVEMENTS */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-300 block">
                      Recommended Enhancements:
                    </span>
                    {criticResult.recommendedImprovements?.map((imp, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                        <span className="text-indigo-400 font-bold">•</span>
                        <span>{imp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="text-[10px] text-slate-500 text-center pt-2 border-t border-white/5">
              Powered by OpenRouter Free Distributed Systems Evaluator
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
