"use client";

import { ReactNode, useEffect, useState } from "react";
import { StreamVideoClient, StreamVideo } from "@stream-io/video-react-sdk";
import { useUser } from "@clerk/nextjs";
import { streamTokenProvider } from "@/actions/stream.actions";

const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
  const [streamVideoClient, setStreamVideoClient] = useState<StreamVideoClient | null>(null);
  const [isWsError, setIsWsError] = useState<boolean>(false);
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !user) return;

    const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
    if (!apiKey) return;

    let isMounted = true;

    // Initialize client without immediate auto-connect in constructor
    const client = new StreamVideoClient({ apiKey });

    // Explicitly connect user and catch WebSocket failure gracefully
    client
      .connectUser(
        {
          id: user.id,
          name: user.firstName || "" + " " + user.lastName || "" || user.id,
          image: user.imageUrl,
        },
        streamTokenProvider
      )
      .then(() => {
        if (isMounted) {
          setStreamVideoClient(client);
        }
      })
      .catch((err) => {
        console.warn(
          "GetStream WebSocket connection failed (App may be suspended or credentials inactive):",
          err?.message || err
        );
        if (isMounted) {
          setIsWsError(true);
        }
      });

    return () => {
      isMounted = false;
      client.disconnectUser().catch(() => {});
    };
  }, [user, isLoaded]);

  // If user is unauthenticated, client is connecting, or Stream WS failed:
  // Render children normally so the platform continues operating smoothly.
  if (!user || !streamVideoClient || isWsError) {
    return <>{children}</>;
  }

  return <StreamVideo client={streamVideoClient}>{children}</StreamVideo>;
};

export default StreamVideoProvider;