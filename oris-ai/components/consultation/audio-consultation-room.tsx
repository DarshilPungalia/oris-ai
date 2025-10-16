"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  StartAudio,
  useVoiceAssistant,
  BarVisualizer,
  useConnectionState,
  useDataChannel,
  useLocalParticipant,
  useTracks,
  TrackToggle,
} from "@livekit/components-react";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  MessageSquare,
  Phone,
  ArrowLeft,
} from "lucide-react";
import { ConnectionState, Track, LocalParticipant } from "livekit-client";
import { useRouter } from "next/navigation";

interface ChatMessage {
  name: string;
  message: string;
  timestamp: number;
  isSelf: boolean;
}

interface AudioConsultationRoomProps {
  wsUrl: string;
  token: string;
}

function ConsultationInterface() {
  const router = useRouter();
  const { state, audioTrack, agentTranscriptions, agentAttributes } =
    useVoiceAssistant();
  const [transcripts, setTranscripts] = useState<ChatMessage[]>([]);
  const [showTranscripts, setShowTranscripts] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentAgentMessage, setCurrentAgentMessage] = useState("");
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  const { localParticipant } = useLocalParticipant();
  const connectionState = useConnectionState();
  const [elapsedTime, setElapsedTime] = useState(0);

  // Timer for consultation duration
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Handle agent transcriptions with better streaming detection
  useEffect(() => {
    if (agentTranscriptions.length > 0) {
      const latestTranscription =
        agentTranscriptions[agentTranscriptions.length - 1];

      if (latestTranscription.text && latestTranscription.text.trim()) {
        // Only add to transcript when the agent completely finishes speaking
        // Check if this message is significantly different from the last one we added
        const lastTranscript = transcripts.filter((t) => !t.isSelf).pop();
        const isDifferentMessage =
          !lastTranscript ||
          !latestTranscription.text.startsWith(
            lastTranscript.message.substring(0, 20)
          );

        if (state !== "speaking" && isDifferentMessage) {
          // Agent has finished speaking and this is a new/complete message
          setTranscripts((prev) => [
            ...prev,
            {
              name: "Daela",
              message: latestTranscription.text,
              timestamp: Date.now(),
              isSelf: false,
            },
          ]);
        }

        // Update current streaming message for live display
        if (state === "speaking") {
          setCurrentAgentMessage(latestTranscription.text);
          setIsAgentSpeaking(true);
        } else {
          setCurrentAgentMessage("");
          setIsAgentSpeaking(false);
        }
      }
    }
  }, [agentTranscriptions, state, transcripts]);

  const handleDisconnect = useCallback(() => {
    router.push("/");
  }, [router]);

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-primary text-primary-foreground p-4 rounded-full shadow-lg cursor-pointer"
          onClick={() => setIsMinimized(false)}
        >
          <MessageSquare className="w-6 h-6" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-background to-secondary/5 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-border p-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleDisconnect}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                Dental Consultation with Daela
              </h1>
              <p className="text-sm text-muted-foreground">
                Duration: {formatTime(elapsedTime)} •{" "}
                {connectionState === ConnectionState.Connected
                  ? "Connected"
                  : "Connecting..."}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowTranscripts(!showTranscripts)}
              className={`p-2 rounded-lg transition-colors ${
                showTranscripts
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-secondary"
              }`}
            >
              <MessageSquare className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Audio Area */}
        <div className="flex-1 flex flex-col">
          {/* Audio Visualization Area */}
          <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-8">
            {/* AI Avatar */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: state === "speaking" ? [1, 1.05, 1] : 1,
                opacity: 1,
                rotate: state === "thinking" ? [0, 2, -2, 0] : 0,
              }}
              transition={{
                scale: {
                  duration: state === "speaking" ? 0.5 : 0.3,
                  repeat: state === "speaking" ? Infinity : 0,
                  ease: "easeInOut",
                },
                rotate: {
                  duration: state === "thinking" ? 1.5 : 0.3,
                  repeat: state === "thinking" ? Infinity : 0,
                  ease: "easeInOut",
                },
                opacity: { duration: 0.3 },
              }}
              className="relative"
            >
              <motion.div
                animate={{
                  boxShadow:
                    state === "listening"
                      ? [
                          "0 0 0 0 rgba(59, 130, 246, 0.4)",
                          "0 0 0 20px rgba(59, 130, 246, 0)",
                          "0 0 0 0 rgba(59, 130, 246, 0.4)",
                        ]
                      : state === "speaking"
                      ? [
                          "0 0 20px rgba(34, 197, 94, 0.6)",
                          "0 0 40px rgba(34, 197, 94, 0.8)",
                          "0 0 20px rgba(34, 197, 94, 0.6)",
                        ]
                      : "0 0 10px rgba(0, 0, 0, 0.1)",
                }}
                transition={{
                  duration:
                    state === "listening" ? 2 : state === "speaking" ? 1 : 0.3,
                  repeat:
                    state === "listening" || state === "speaking"
                      ? Infinity
                      : 0,
                  ease: "easeInOut",
                }}
                className={`w-32 h-32 rounded-full bg-gradient-to-br flex items-center justify-center shadow-2xl transition-all duration-300 ${
                  state === "listening"
                    ? "from-blue-500 to-blue-600"
                    : state === "speaking"
                    ? "from-green-500 to-green-600"
                    : state === "thinking"
                    ? "from-yellow-500 to-orange-500"
                    : "from-primary to-secondary"
                }`}
              >
                <motion.span
                  animate={{
                    scale: state === "speaking" ? [1, 1.1, 1] : 1,
                    opacity: state === "thinking" ? [1, 0.7, 1] : 1,
                  }}
                  transition={{
                    duration:
                      state === "speaking"
                        ? 0.4
                        : state === "thinking"
                        ? 1
                        : 0.3,
                    repeat:
                      state === "speaking" || state === "thinking"
                        ? Infinity
                        : 0,
                    ease: "easeInOut",
                  }}
                  className="text-4xl font-bold text-white"
                >
                  D
                </motion.span>
              </motion.div>

              {/* Audio visualization around avatar */}
              {audioTrack && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{
                      scale: state === "speaking" ? [1, 1.1, 1] : 1,
                      opacity: state === "listening" ? [0.3, 0.8, 0.3] : 0.5,
                    }}
                    transition={{
                      duration:
                        state === "speaking"
                          ? 0.6
                          : state === "listening"
                          ? 1.5
                          : 0.3,
                      repeat:
                        state === "speaking" || state === "listening"
                          ? Infinity
                          : 0,
                      ease: "easeInOut",
                    }}
                    className={`w-40 h-40 rounded-full border-2 transition-colors duration-300 ${
                      state === "listening"
                        ? "border-blue-400/40"
                        : state === "speaking"
                        ? "border-green-400/40"
                        : "border-primary/20"
                    }`}
                  >
                    <BarVisualizer
                      state={state}
                      trackRef={audioTrack}
                      className="rounded-full"
                      options={{
                        minHeight: 20,
                        maxHeight: 60,
                      }}
                    />
                  </motion.div>
                </div>
              )}

              {/* Additional animated rings for enhanced visual feedback */}
              <motion.div
                animate={{
                  scale:
                    state === "listening"
                      ? [1, 1.3, 1]
                      : state === "speaking"
                      ? [1, 1.2, 1]
                      : 1,
                  opacity:
                    state === "listening"
                      ? [0, 0.3, 0]
                      : state === "speaking"
                      ? [0, 0.4, 0]
                      : 0,
                }}
                transition={{
                  duration:
                    state === "listening" ? 2 : state === "speaking" ? 1 : 0.3,
                  repeat:
                    state === "listening" || state === "speaking"
                      ? Infinity
                      : 0,
                  ease: "easeInOut",
                }}
                className={`absolute inset-0 w-48 h-48 rounded-full border transition-colors duration-300 ${
                  state === "listening"
                    ? "border-blue-300/30"
                    : state === "speaking"
                    ? "border-green-300/30"
                    : "border-transparent"
                }`}
                style={{
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              />

              {/* Floating particles */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: state === "speaking" ? [-15, 15, -15] : [-10, 10, -10],
                    x: state === "thinking" ? [-10, 10, -10] : [-5, 5, -5],
                    opacity:
                      state === "speaking"
                        ? [0.4, 0.8, 0.4]
                        : state === "listening"
                        ? [0.2, 0.6, 0.2]
                        : 0.3,
                    scale:
                      state === "speaking" ? [0.8, 1.2, 0.8] : [0.8, 1, 0.8],
                  }}
                  transition={{
                    duration: 2 + i * 0.3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.2,
                  }}
                  className={`absolute w-2 h-2 rounded-full transition-colors duration-300 ${
                    state === "listening"
                      ? "bg-blue-400/60"
                      : state === "speaking"
                      ? "bg-green-400/60"
                      : state === "thinking"
                      ? "bg-yellow-400/60"
                      : "bg-primary/40"
                  }`}
                  style={{
                    left: `${50 + 25 * Math.cos((i * Math.PI * 2) / 6)}%`,
                    top: `${50 + 25 * Math.sin((i * Math.PI * 2) / 6)}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                />
              ))}
            </motion.div>

            {/* Status Text */}
            <motion.div
              animate={{
                y: state === "speaking" ? [0, -2, 0] : 0,
                scale: state === "listening" ? [1, 1.02, 1] : 1,
              }}
              transition={{
                duration:
                  state === "speaking"
                    ? 0.5
                    : state === "listening"
                    ? 1.5
                    : 0.3,
                repeat:
                  state === "speaking" || state === "listening" ? Infinity : 0,
                ease: "easeInOut",
              }}
              className="text-center space-y-2"
            >
              <motion.h2
                animate={{
                  color:
                    state === "listening"
                      ? ["#3b82f6", "#1d4ed8", "#3b82f6"]
                      : state === "speaking"
                      ? ["#22c55e", "#15803d", "#22c55e"]
                      : state === "thinking"
                      ? ["#f59e0b", "#d97706", "#f59e0b"]
                      : "#000000",
                }}
                transition={{
                  duration:
                    state === "listening"
                      ? 2
                      : state === "speaking"
                      ? 1
                      : state === "thinking"
                      ? 1.5
                      : 0.3,
                  repeat:
                    state === "listening" ||
                    state === "speaking" ||
                    state === "thinking"
                      ? Infinity
                      : 0,
                  ease: "easeInOut",
                }}
                className="text-xl font-medium"
              >
                {state === "listening"
                  ? "Listening..."
                  : state === "thinking"
                  ? "Daela is thinking..."
                  : state === "speaking"
                  ? "Daela is speaking..."
                  : "Ready to help"}
              </motion.h2>
              <motion.p
                animate={{
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="text-muted-foreground"
              >
                Speak naturally to chat with Daela
              </motion.p>
            </motion.div>

            {/* Audio Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex items-center space-x-4"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow:
                    state === "listening"
                      ? [
                          "0 0 0 0 rgba(59, 130, 246, 0.4)",
                          "0 0 0 10px rgba(59, 130, 246, 0)",
                          "0 0 0 0 rgba(59, 130, 246, 0.4)",
                        ]
                      : "0 4px 14px 0 rgba(0, 0, 0, 0.1)",
                }}
                transition={{
                  duration: state === "listening" ? 1.5 : 0.3,
                  repeat: state === "listening" ? Infinity : 0,
                  ease: "easeInOut",
                }}
              >
                <TrackToggle
                  source={Track.Source.Microphone}
                  className="w-14 h-14 p-5 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-colors"
                >
                  {/* <Mic className="w-6 h-6" /> */}
                </TrackToggle>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDisconnect}
                className="p-4 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg transition-colors"
              >
                <Phone className="w-6 h-6" />
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Transcript Sidebar */}
        <AnimatePresence>
          {showTranscripts && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 400, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-l border-border flex flex-col"
            >
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold text-foreground">
                  Conversation Transcript
                </h3>
                <p className="text-sm text-muted-foreground">
                  Real-time conversation log
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {transcripts.map((transcript, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3 rounded-lg ${
                      transcript.isSelf
                        ? "bg-primary/10 ml-4"
                        : "bg-secondary/20 mr-4"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">
                        {transcript.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(transcript.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-foreground">
                      {transcript.message}
                    </p>
                  </motion.div>
                ))}

                {/* Show streaming message from agent */}
                {isAgentSpeaking && currentAgentMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-lg bg-secondary/20 mr-4 border-2 border-primary/20"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">
                        Daela
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse mr-1" />
                        typing...
                      </span>
                    </div>
                    <p className="text-sm text-foreground">
                      {currentAgentMessage}
                    </p>
                  </motion.div>
                )}

                {transcripts.length === 0 && !isAgentSpeaking && (
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Conversation will appear here
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Audio Elements */}
      <RoomAudioRenderer />
      <StartAudio label="Click to enable audio" />
    </div>
  );
}

export function AudioConsultationRoom({
  wsUrl,
  token,
}: AudioConsultationRoomProps) {
  return (
    <LiveKitRoom
      token={token}
      serverUrl={wsUrl}
      connect={true}
      audio={true}
      video={false} // Explicitly disable video
      className="h-screen"
    >
      <ConsultationInterface />
    </LiveKitRoom>
  );
}
