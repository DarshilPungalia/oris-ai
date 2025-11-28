"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  StartAudio,
  useVoiceAssistant,
  BarVisualizer,
} from "@livekit/components-react";
import { Mic, MicOff, Volume2, X } from "lucide-react";
import { Track } from "livekit-client";

interface LiveKitConsultationProps {
  wsUrl: string;
  token: string;
  onClose: () => void;
}

function ConsultationRoom({ onClose }: { onClose: () => void }) {
  const { state, audioTrack } = useVoiceAssistant();
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border/10">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
          <div>
            <h3 className="font-semibold text-lg">AI Dental Consultation</h3>
            <p className="text-sm text-muted-foreground">
              Connected with Daela, your AI dental assistant
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-background/10 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-8">
        {/* AI Status */}
        <div className="text-center space-y-4">
          <motion.div
            animate={{ scale: state === "speaking" ? [1, 1.1, 1] : 1 }}
            transition={{
              repeat: state === "speaking" ? Infinity : 0,
              duration: 1,
            }}
            className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto"
          >
            <div className="text-white text-4xl font-bold">D</div>
          </motion.div>

          <div>
            <p className="text-xl font-semibold">Daela AI Assistant</p>
            <p className="text-muted-foreground">
              {state === "listening" && "Listening..."}
              {state === "thinking" && "Processing your question..."}
              {state === "speaking" && "Speaking..."}
              {!state && "Ready to help with your dental concerns"}
            </p>
          </div>
        </div>

        {/* Audio Visualizer */}
        {audioTrack && (
          <div className="w-full max-w-md">
            <BarVisualizer
              state={state}
              trackRef={audioTrack}
              barCount={7}
              options={{ minHeight: 24, maxHeight: 80 }}
            />
          </div>
        )}

        {/* Instructions */}
        <div className="text-center max-w-md space-y-2">
          <p className="text-sm text-muted-foreground">
            Speak naturally about your dental concerns. Daela can help with:
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div>• Pain assessment</div>
            <div>• Treatment guidance</div>
            <div>• Appointment booking</div>
            <div>• Emergency evaluation</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-6 border-t border-border/10">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setIsAudioEnabled(!isAudioEnabled)}
            className={`p-4 rounded-full transition-all ${
              isAudioEnabled
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-red-500 hover:bg-red-600 text-white"
            }`}
          >
            {isAudioEnabled ? (
              <Mic className="w-6 h-6" />
            ) : (
              <MicOff className="w-6 h-6" />
            )}
          </button>

          <div className="flex items-center gap-2 px-4 py-2 bg-background/20 rounded-full">
            <Volume2 className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Audio ON</span>
          </div>
        </div>
      </div>

      <RoomAudioRenderer />
      <StartAudio label="Click to enable audio" />
    </div>
  );
}

export function LiveKitConsultation({
  wsUrl,
  token,
  onClose,
}: LiveKitConsultationProps) {
  const [isConnecting, setIsConnecting] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsConnecting(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isConnecting) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-background">
        <div className="text-center space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"
          />
          <div>
            <p className="text-xl font-semibold">Connecting to Daela...</p>
            <p className="text-muted-foreground">
              Setting up your AI dental consultation
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <LiveKitRoom
      video={false}
      audio={true}
      token={token}
      serverUrl={wsUrl}
      data-lk-theme="default"
      style={{ height: "100%" }}
      onConnected={() => setIsConnecting(false)}
    >
      <ConsultationRoom onClose={onClose} />
    </LiveKitRoom>
  );
}
