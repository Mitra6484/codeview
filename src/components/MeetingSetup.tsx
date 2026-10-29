"use client";

import { DeviceSettings, useCall, VideoPreview } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import { CameraIcon, MicIcon, SettingsIcon, Loader2, Video, Sparkles, ArrowRight } from "lucide-react";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";

function MeetingSetup({ onSetupComplete }: { onSetupComplete: () => void }) {
  const [isCameraDisabled, setIsCameraDisabled] = useState(true);
  const [isMicDisabled, setIsMicDisabled] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const call = useCall();

  useEffect(() => {
    if (!call) return;
    try {
      if (isCameraDisabled) {
        call.camera?.disable().catch(() => {});
      } else {
        call.camera?.enable().catch(() => {});
      }
    } catch {}
  }, [isCameraDisabled, call]);

  useEffect(() => {
    if (!call) return;
    try {
      if (isMicDisabled) {
        call.microphone?.disable().catch(() => {});
      } else {
        call.microphone?.enable().catch(() => {});
      }
    } catch {}
  }, [isMicDisabled, call]);

  if (!call) return null;

  const handleJoin = async () => {
    setIsJoining(true);
    try {
      await call.join();
      onSetupComplete();
    } catch (err: any) {
      console.warn("Meeting join notice, entering workspace:", err?.message || err);
      onSetupComplete();
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="min-h-screen glass-canvas flex items-center justify-center p-4 sm:p-6 text-slate-200">
      <div className="w-full max-w-[1100px] mx-auto space-y-6">
        {/* TOP BADGE */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="glass-pill px-3 py-1 rounded-full text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Interview Lobby</span>
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">
              Room: <span className="font-mono text-white">{call.id}</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* VIDEO PREVIEW CONTAINER */}
          <div className="glass-card p-6 rounded-3xl flex flex-col justify-between border border-white/15 shadow-2xl">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white tracking-tight">Camera Preview</h2>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  Ready
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Test your video feed and lighting before entering the call</p>
            </div>

            {/* VIDEO PREVIEW FRAME */}
            <div className="mt-4 flex-1 min-h-[340px] rounded-2xl overflow-hidden bg-slate-950/80 border border-white/10 relative flex items-center justify-center">
              <div className="absolute inset-0">
                <VideoPreview className="h-full w-full object-cover" />
              </div>
              {isCameraDisabled && (
                <div className="relative z-10 flex flex-col items-center gap-2 text-slate-500">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
                    <Video className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-medium">Camera is turned off</span>
                </div>
              )}
            </div>
          </div>

          {/* CONTROLS CARD */}
          <div className="glass-card p-6 rounded-3xl flex flex-col justify-between border border-white/15 shadow-2xl">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">Audio & Video Setup</h2>
                <p className="text-xs text-slate-400 mt-0.5">Toggle devices before entering the interview</p>
              </div>

              <div className="space-y-4">
                {/* CAM CONTROL */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between hover:bg-white/[0.05] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-indigo-500/15 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
                      <CameraIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-white">Camera</p>
                      <p className="text-[11px] text-slate-400">
                        {isCameraDisabled ? "Disabled (Audio Only)" : "Enabled"}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={!isCameraDisabled}
                    onCheckedChange={(checked) => setIsCameraDisabled(!checked)}
                  />
                </div>

                {/* MIC CONTROL */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between hover:bg-white/[0.05] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                      <MicIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-white">Microphone</p>
                      <p className="text-[11px] text-slate-400">
                        {isMicDisabled ? "Muted" : "Active"}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={!isMicDisabled}
                    onCheckedChange={(checked) => setIsMicDisabled(!checked)}
                  />
                </div>

                {/* DEVICE SETTINGS */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-violet-500/15 border border-violet-400/30 flex items-center justify-center text-violet-400">
                      <SettingsIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-white">Device Settings</p>
                      <p className="text-[11px] text-slate-400">Select input/output hardware</p>
                    </div>
                  </div>
                  <DeviceSettings />
                </div>
              </div>
            </div>

            {/* JOIN BUTTON */}
            <div className="pt-6 border-t border-white/10 space-y-2 mt-6">
              <Button
                onClick={handleJoin}
                disabled={isJoining}
                className="w-full glass-btn-primary py-3.5 h-auto rounded-2xl text-sm font-semibold text-white flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-indigo-500/25"
              >
                {isJoining ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Connecting to call...</span>
                  </>
                ) : (
                  <>
                    <span>Enter Interview Room</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
              <p className="text-[11px] text-center text-slate-400">
                You can adjust video, microphone, and screen share anytime inside the workspace.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MeetingSetup;
