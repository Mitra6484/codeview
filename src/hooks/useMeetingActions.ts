import { useRouter } from "next/navigation";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import toast from "react-hot-toast";

const useMeetingActions = () => {
  const router = useRouter();
  const client = useStreamVideoClient();

  const createInstantMeeting = async () => {
    try {
      const id = crypto.randomUUID();

      if (client) {
        const call = client.call("default", id);
        await call.getOrCreate({
          data: {
            starts_at: new Date().toISOString(),
            custom: {
              description: "Instant Meeting",
            },
          },
        });
      }

      router.push(`/meeting/${id}`);
      toast.success("Instant Meeting Created");
    } catch (error) {
      console.error("Meeting creation error:", error);
      toast.error("Failed to create meeting room");
    }
  };

  const joinMeeting = (callId: string) => {
    if (!callId.trim()) {
      return toast.error("Please enter a valid meeting ID or link.");
    }
    const cleanId = callId.trim().split("/").pop() || callId.trim();
    router.push(`/meeting/${cleanId}`);
  };

  return { createInstantMeeting, joinMeeting };
};

export default useMeetingActions;
