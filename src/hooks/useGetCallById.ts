import { useEffect, useState, useRef } from "react";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";

const useGetCallById = (id: string | string[]) => {
  const [call, setCall] = useState<Call>();
  const [isCallLoading, setIsCallLoading] = useState(true);

  const client = useStreamVideoClient();
  const callId = Array.isArray(id) ? id[0] : id;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // If client is not yet ready, remain in loading state but set a safety timeout
    if (!client) {
      if (!timeoutRef.current) {
        timeoutRef.current = setTimeout(() => {
          setIsCallLoading(false);
        }, 10000);
      }
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (!callId) {
      setIsCallLoading(false);
      return;
    }

    let isMounted = true;

    const loadCall = async () => {
      setIsCallLoading(true);
      try {
        // Primary pattern: direct call instantiation with getOrCreate()
        const callInstance = client.call("default", callId);
        await callInstance.getOrCreate();

        if (isMounted) {
          setCall(callInstance);
        }
      } catch (directErr) {
        console.warn("Direct call getOrCreate notice, trying query fallback:", directErr);
        try {
          const { calls } = await client.queryCalls({
            filter_conditions: { id: callId },
          });

          if (isMounted) {
            if (calls.length > 0) {
              setCall(calls[0]);
            } else {
              // Return call instance directly so user can still enter room
              const fallbackCall = client.call("default", callId);
              setCall(fallbackCall);
            }
          }
        } catch (queryErr) {
          console.error("Failed to query call, using client call instance:", queryErr);
          if (isMounted) {
            const fallbackCall = client.call("default", callId);
            setCall(fallbackCall);
          }
        }
      } finally {
        if (isMounted) {
          setIsCallLoading(false);
        }
      }
    };

    loadCall();

    return () => {
      isMounted = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [client, callId]);

  return { call, isCallLoading };
};

export default useGetCallById;
