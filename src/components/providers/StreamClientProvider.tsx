"use client";

import { ReactNode, useEffect, useState, useRef } from "react";
import { StreamVideoClient, StreamVideo } from "@stream-io/video-react-sdk";
import { useUser } from "@clerk/nextjs";
import { streamTokenProvider } from "@/actions/stream.actions";

const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
  const [streamVideoClient, setStreamVideoClient] = useState<StreamVideoClient | null>(null);
  const [isWsError, setIsWsError] = useState<boolean>(false);
  const { user, isLoaded } = useUser();
  const clientRef = useRef<StreamVideoClient | null>(null);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
    if (!apiKey) {
      console.warn("NEXT_PUBLIC_STREAM_API_KEY is not configured.");
      return;
    }

    let isMounted = true;

    const displayName =
      user.fullName ||
      (user.firstName
        ? `${user.firstName} ${user.lastName || ""}`.trim()
        : user.username || user.id);

    const client = new StreamVideoClient({ apiKey });
    clientRef.current = client;

    // Connect user with token provider
    client
      .connectUser(
        {
          id: user.id,
          name: displayName,
          image: user.imageUrl,
        },
        streamTokenProvider
      )
      .then(() => {
        if (isMounted) {
          setStreamVideoClient(client);
          setIsWsError(false);
        }
      })
      .catch((err) => {
        console.warn(
          "GetStream connection notice:",
          err?.message || err
        );
        if (isMounted) {
          setIsWsError(true);
        }
      });

    return () => {
      isMounted = false;
      // Delay disconnect slightly to avoid StrictMode double-mount tearing down WebSocket
      setTimeout(() => {
        if (!isMounted && clientRef.current) {
          clientRef.current.disconnectUser().catch(() => {});
        }
      }, 500);
    };
  }, [user, isLoaded]);

  // If user is unauthenticated or Stream failed to connect:
  if (!user || !streamVideoClient) {
    return <>{children}</>;
  }

  return <StreamVideo client={streamVideoClient}>{children}</StreamVideo>;
};

export default StreamVideoProvider;
