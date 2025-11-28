"use client";

import { useState, useCallback } from "react";

export type ConnectionMode = "env";

type ConnectionDetails = {
  wsUrl: string;
  token: string;
  roomName: string;
  shouldConnect: boolean;
  mode: ConnectionMode;
};

export function useConnection() {
  const [connectionDetails, setConnectionDetails] = useState<ConnectionDetails>(
    {
      wsUrl: "",
      token: "",
      roomName: "",
      shouldConnect: false,
      mode: "env",
    }
  );

  const connect = useCallback(async (mode: ConnectionMode) => {
    try {
      // Use environment variables for LiveKit connection
      const wsUrl =
        process.env.NEXT_PUBLIC_LIVEKIT_WS_URL ||
        "wss://dental-ai-qgkpljdz.livekit.cloud";

      // Get token from our API
      const response = await fetch("/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to get token");
      }

      const data = await response.json();

      setConnectionDetails({
        wsUrl,
        token: data.accessToken,
        roomName: data.roomName,
        shouldConnect: true,
        mode,
      });
    } catch (error) {
      console.error("Connection error:", error);
      throw error;
    }
  }, []);

  const disconnect = useCallback(async () => {
    setConnectionDetails((prev) => ({
      ...prev,
      shouldConnect: false,
    }));
  }, []);

  return {
    wsUrl: connectionDetails.wsUrl,
    token: connectionDetails.token,
    roomName: connectionDetails.roomName,
    shouldConnect: connectionDetails.shouldConnect,
    connect,
    disconnect,
  };
}
