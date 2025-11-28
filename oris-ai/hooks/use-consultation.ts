"use client";

import { useState, useCallback } from "react";

interface UseConsultationOptions {
  roomName?: string;
  participantName?: string;
  onConnected?: () => void;
  onDisconnected?: () => void;
  onError?: (error: Error) => void;
}

interface ConsultationState {
  isConnecting: boolean;
  isConnected: boolean;
  error: string | null;
  roomName: string | null;
  token: string | null;
  wsUrl: string | null;
}

export function useConsultation(options: UseConsultationOptions = {}) {
  const [state, setState] = useState<ConsultationState>({
    isConnecting: false,
    isConnected: false,
    error: null,
    roomName: null,
    token: null,
    wsUrl: null,
  });

  const connect = useCallback(
    async (participantName: string) => {
      try {
        setState((prev) => ({ ...prev, isConnecting: true, error: null }));

        // Get access token from our API
        const response = await fetch("/api/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to get access token: ${response.status}`);
        }

        const data = await response.json();

        // Use environment variable for WebSocket URL
        const wsUrl =
          process.env.NEXT_PUBLIC_LIVEKIT_WS_URL ||
          "wss://dental-ai-qgkpljdz.livekit.cloud";

        setState((prev) => ({
          ...prev,
          isConnecting: false,
          isConnected: true,
          roomName: data.roomName,
          token: data.accessToken,
          wsUrl: wsUrl,
        }));

        options.onConnected?.();

        return {
          token: data.accessToken,
          wsUrl: wsUrl,
          roomName: data.roomName,
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Connection failed";
        setState((prev) => ({
          ...prev,
          isConnecting: false,
          isConnected: false,
          error: errorMessage,
        }));

        options.onError?.(
          error instanceof Error ? error : new Error(errorMessage)
        );
        throw error;
      }
    },
    [options]
  );

  const disconnect = useCallback(async () => {
    try {
      setState((prev) => ({
        ...prev,
        isConnected: false,
        roomName: null,
        token: null,
        wsUrl: null,
      }));

      options.onDisconnected?.();
    } catch (error) {
      console.error("Disconnect error:", error);
    }
  }, [options]);

  return {
    ...state,
    connect,
    disconnect,
  };
}
