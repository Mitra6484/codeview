"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import {
  Bell,
  CheckCircle2,
  XCircle,
  Calendar,
  AlertCircle,
  ExternalLink,
  CheckCheck,
  Trash2,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useRef, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

type FilterTab = "all" | "interviews" | "results" | "system";

export function NotificationBell() {
  const { user } = useUser();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const lastNotificationRef = useRef<string | null>(null);

  const notifications = useQuery(api.notifications.getNotifications, {
    userId: user?.id || "",
  });
  const unreadCount = useQuery(api.notifications.getUnreadCount, {
    userId: user?.id || "",
  });

  const markAsRead = useMutation(api.notifications.markAsRead);
  const markAllAsRead = useMutation(api.notifications.markAllAsRead);
  const deleteNotification = useMutation(api.notifications.deleteNotification);
  const deleteAllNotifications = useMutation(api.notifications.deleteAllNotifications);

  // Play audio chime for new notifications
  const playChime = () => {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch {
      // Audio context might be restricted before user gesture
    }
  };

  // Toast and audio trigger when a new unread notification arrives
  useEffect(() => {
    if (notifications && notifications.length > 0) {
      const latest = notifications[0];
      if (latest._id !== lastNotificationRef.current) {
        lastNotificationRef.current = latest._id;
        if (!latest.read) {
          playChime();
          toast(latest.title || latest.message, {
            icon: latest.type === "interview_result" ? "🎯" : "🔔",
            duration: 4500,
            style: {
              background: "#0f172a",
              color: "#f8fafc",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
              fontSize: "13px",
            },
          });
        }
      }
    }
  }, [notifications, soundEnabled]);

  const handleNotificationClick = async (notification: {
    _id: Id<"notifications">;
    read: boolean;
    link?: string;
  }) => {
    if (!notification.read) {
      await markAsRead({ notificationId: notification._id });
    }
    if (notification.link) {
      setIsOpen(false);
      router.push(notification.link);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (user?.id) {
      await markAllAsRead({ userId: user.id });
      toast.success("All notifications marked as read");
    }
  };

  const handleClearAll = async () => {
    if (user?.id) {
      await deleteAllNotifications({ userId: user.id });
      toast.success("Notification inbox cleared");
    }
  };

  const handleDeleteNotification = async (
    e: React.MouseEvent,
    notificationId: Id<"notifications">
  ) => {
    e.stopPropagation();
    await deleteNotification({ notificationId });
  };

  // Filter items by active tab
  const filteredNotifications = (notifications || []).filter((item) => {
    if (activeTab === "all") return true;
    if (activeTab === "interviews") {
      return (
        item.type === "interview_scheduled" ||
        item.type === "interview_reminder"
      );
    }
    if (activeTab === "results") {
      return item.type === "interview_result";
    }
    if (activeTab === "system") {
      return item.type === "system";
    }
    return true;
  });

  const getNotificationIcon = (type: string, message: string) => {
    switch (type) {
      case "interview_result":
        return message.toLowerCase().includes("succeeded") ||
          message.toLowerCase().includes("passed") ? (
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center shrink-0">
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
        );
      case "interview_scheduled":
      case "interview_reminder":
        return (
          <div className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center shrink-0">
            <Calendar className="w-4 h-4 text-indigo-400" />
          </div>
        );
      case "system":
      default:
        return (
          <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0">
            <AlertCircle className="w-4 h-4 text-cyan-400" />
          </div>
        );
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-xl hover:bg-white/10 transition-colors"
          aria-label="Open notifications"
        >
          <Bell className="h-4 w-4 text-slate-300" />
          {unreadCount !== undefined && unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 px-1 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex items-center justify-center rounded-full h-4 min-w-4 px-1 bg-gradient-to-r from-rose-500 to-indigo-600 text-[10px] font-extrabold text-white shadow-lg">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[380px] p-0 rounded-2xl border border-white/15 bg-slate-950/95 backdrop-blur-2xl shadow-2xl overflow-hidden text-white"
        align="end"
        sideOffset={8}
      >
        {/* HEADER */}
        <div className="p-3.5 border-b border-white/10 bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-bold tracking-tight text-white flex items-center gap-1.5">
              <span>Notifications</span>
              {unreadCount !== undefined && unreadCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-md bg-indigo-500/20 text-indigo-300 text-[10px] font-mono font-semibold border border-indigo-500/30">
                  {unreadCount} unread
                </span>
              )}
            </h4>
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            {/* Sound Toggle Button */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1 rounded-lg hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              title={soundEnabled ? "Mute notification chime" : "Unmute notification chime"}
            >
              {soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-slate-300" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-slate-500" />
              )}
            </button>

            {/* Mark All Read */}
            {unreadCount !== undefined && unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="p-1 rounded-lg hover:bg-white/10 text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Clear All */}
            {notifications && notifications.length > 0 && (
              <button
                onClick={handleClearAll}
                className="p-1 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                title="Clear all notifications"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* CATEGORY TABS */}
        <div className="flex items-center gap-1 px-3 py-2 border-b border-white/5 bg-slate-900/30 text-[11px] overflow-x-auto">
          {[
            { id: "all", label: "All" },
            { id: "interviews", label: "Interviews" },
            { id: "results", label: "Scorecards" },
            { id: "system", label: "System" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as FilterTab)}
              className={cn(
                "px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap",
                activeTab === tab.id
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* NOTIFICATIONS LIST */}
        <ScrollArea className="h-[340px]">
          {filteredNotifications && filteredNotifications.length > 0 ? (
            <div className="p-2 space-y-1.5">
              <AnimatePresence initial={false}>
                {filteredNotifications.map((notification) => (
                  <motion.div
                    key={notification._id}
                    layout
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    onClick={() => handleNotificationClick(notification)}
                    className={cn(
                      "group relative p-2.5 rounded-xl transition-all cursor-pointer border flex items-start gap-3",
                      notification.read
                        ? "bg-white/[0.02] border-white/5 hover:bg-white/[0.05]"
                        : "bg-indigo-500/[0.08] border-indigo-500/25 hover:bg-indigo-500/[0.12] shadow-sm"
                    )}
                  >
                    {/* Unread indicator pip */}
                    {!notification.read && (
                      <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                    )}

                    {getNotificationIcon(notification.type, notification.message)}

                    <div className="flex-1 min-w-0 pr-5">
                      <div className="flex items-center gap-1.5">
                        <p className="font-semibold text-xs text-white truncate">
                          {notification.title}
                        </p>
                        {notification.link && (
                          <ExternalLink className="w-3 h-3 text-slate-400 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-2 leading-relaxed">
                        {notification.message}
                      </p>
                      <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>

                    {/* Delete action on hover */}
                    <button
                      onClick={(e) => handleDeleteNotification(e, notification._id)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                      title="Dismiss"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="py-14 px-4 text-center space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-slate-500">
                <Bell className="w-5 h-5 opacity-40" />
              </div>
              <p className="text-xs text-slate-300 font-semibold">No notifications</p>
              <p className="text-[11px] text-slate-500 max-w-[220px] mx-auto">
                {activeTab === "all"
                  ? "You're all caught up! New interview invites and scorecards will show here."
                  : `No ${activeTab} notifications at the moment.`}
              </p>
            </div>
          )}
        </ScrollArea>

        {/* FOOTER */}
        <div className="p-2 border-t border-white/10 bg-slate-900/40 text-center">
          <span className="text-[10px] text-slate-500 font-mono">
            CodeView Real-Time Sync
          </span>
        </div>
      </PopoverContent>
    </Popover>
  );
}
